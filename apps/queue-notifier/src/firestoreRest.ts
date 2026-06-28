import type {
	AssignmentDocument,
	Fetcher,
	MessagingTokenDocument,
	NexusCreatedEventDocument,
	NexusEventState,
	QualificationScheduleSummary,
} from "./types";

type FirestoreDocument = {
	name: string;
	fields?: Record<string, FirestoreValue>;
};

type FirestoreValue = {
	stringValue?: string;
	integerValue?: string;
	doubleValue?: number;
	booleanValue?: boolean;
	timestampValue?: string;
	nullValue?: null;
	arrayValue?: {
		values?: FirestoreValue[];
	};
};

export class FirestoreRestClient {
	private readonly baseUrl: string;

	constructor(
		private readonly projectId: string,
		private readonly accessToken: string | null,
		private readonly fetcher: Fetcher = globalThis.fetch.bind(globalThis),
		baseUrl?: string,
	) {
		this.baseUrl = baseUrl ?? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
	}

	async getNexusEventState(eventId: string): Promise<NexusEventState | null> {
		const response = await this.fetcher(`${this.baseUrl}/nexusEventStates/${encodeURIComponent(eventId)}`, {
			headers: this.authHeaders(),
		});

		if (response.status === 404) {
			return null;
		}

		await assertOk(response, "read Nexus event state");
		const document = await response.json() as FirestoreDocument;
		return {
			lastDataAsOfTime: numberField(document.fields?.last_data_as_of_time),
			qualificationScheduleReleasedAt: timestampField(document.fields?.qualification_schedule_released_at),
			qualificationScheduleReleaseDataAsOfTime: numberField(document.fields?.qualification_schedule_release_data_as_of_time),
			qualificationScheduleMatchCount: numberField(document.fields?.qualification_schedule_match_count),
		};
	}

	async setNexusEventState(
		eventId: string,
		dataAsOfTime: number,
		qualificationSchedule?: QualificationScheduleSummary | null,
	) {
		const fields: Record<string, FirestoreValue> = {
			last_data_as_of_time: {integerValue: dataAsOfTime.toString()},
			updated_at: {timestampValue: new Date().toISOString()},
		};
		const updateMask = ["last_data_as_of_time", "updated_at"];

		if (qualificationSchedule) {
			fields.qualification_schedule_released_at = {timestampValue: new Date().toISOString()};
			fields.qualification_schedule_release_data_as_of_time = {integerValue: dataAsOfTime.toString()};
			fields.qualification_schedule_match_count = {integerValue: qualificationSchedule.matchCount.toString()};
			updateMask.push(
				"qualification_schedule_released_at",
				"qualification_schedule_release_data_as_of_time",
				"qualification_schedule_match_count",
			);
		}

		await this.patchDocument(
			`nexusEventStates/${eventId}`,
			fields,
			updateMask,
		);
	}

	async eventExists(eventId: string) {
		const response = await this.fetcher(`${this.baseUrl}/events/${encodeURIComponent(eventId)}`, {
			headers: this.authHeaders(),
		});

		if (response.status === 404) {
			return false;
		}

		await assertOk(response, "read event");
		return true;
	}

	async createEventFromNexusSchedule(event: NexusCreatedEventDocument) {
		await this.patchDocument(
			`events/${event.key}`,
			{
				key: {stringValue: event.key},
				name: {stringValue: event.name},
				event_code: {stringValue: event.event_code},
				event_type: {integerValue: event.event_type.toString()},
				city: event.city ? {stringValue: event.city} : {nullValue: null},
				state_prov: event.state_prov ? {stringValue: event.state_prov} : {nullValue: null},
				country: {stringValue: event.country},
				start_date: {stringValue: event.start_date},
				end_date: {stringValue: event.end_date},
				year: {integerValue: event.year.toString()},
				teams: {arrayValue: {values: event.teams.map(team => ({stringValue: team}))}},
				active: {booleanValue: event.active},
			},
			[
				"key",
				"name",
				"event_code",
				"event_type",
				"city",
				"state_prov",
				"country",
				"start_date",
				"end_date",
				"year",
				"teams",
				"active",
			],
		);
	}

	async getAssignment(eventId: string, assignmentId: string): Promise<AssignmentDocument | null> {
		const response = await this.fetcher(
			`${this.baseUrl}/events/${encodeURIComponent(eventId)}/assignments/${encodeURIComponent(assignmentId)}`,
			{
				headers: this.authHeaders(),
			},
		);

		if (response.status === 404) {
			return null;
		}

		await assertOk(response, "read assignment");
		const document = await response.json() as FirestoreDocument;
		return assignmentFromDocument(eventId, document);
	}

	async listAssignments(eventId: string): Promise<AssignmentDocument[]> {
		const response = await this.fetcher(`${this.baseUrl}/events/${encodeURIComponent(eventId)}/assignments`, {
			headers: this.authHeaders(),
		});

		if (response.status === 404) {
			return [];
		}

		await assertOk(response, "list assignments");
		const data = await response.json() as {documents?: FirestoreDocument[]};
		return (data.documents ?? []).map(document => assignmentFromDocument(eventId, document));
	}

	async listMessagingTokens(userId: string): Promise<MessagingTokenDocument[]> {
		const response = await this.fetcher(`${this.baseUrl}/users/${encodeURIComponent(userId)}/messagingTokens`, {
			headers: this.authHeaders(),
		});

		if (response.status === 404) {
			return [];
		}

		await assertOk(response, "list messaging tokens");
		const data = await response.json() as {documents?: FirestoreDocument[]};
		return (data.documents ?? []).map(tokenFromDocument);
	}

	async markAssignmentNotificationResult(
		eventId: string,
		assignmentId: string,
		data: {
			dataAsOfTime: number;
			status: string;
			result: string;
			error: string | null;
			wasSent: boolean;
		},
	) {
		const fields: Record<string, FirestoreValue> = {
			last_nexus_status: {stringValue: data.status},
			nexus_data_as_of_time: {integerValue: data.dataAsOfTime.toString()},
			notification_result: {stringValue: data.result},
			notification_error: data.error ? {stringValue: data.error} : {nullValue: null},
		};
		const updateMask = [
			"last_nexus_status",
			"nexus_data_as_of_time",
			"notification_result",
			"notification_error",
		];

		if (data.wasSent) {
			fields.notified_at = {timestampValue: new Date().toISOString()};
			updateMask.push("notified_at");
		}

		await this.patchDocument(`events/${eventId}/assignments/${assignmentId}`, fields, updateMask);
	}

	private async patchDocument(path: string, fields: Record<string, FirestoreValue>, updateMask: string[]) {
		const url = new URL(`${this.baseUrl}/${path.split("/").map(encodeURIComponent).join("/")}`);

		for (const fieldPath of updateMask) {
			url.searchParams.append("updateMask.fieldPaths", fieldPath);
		}

		const response = await this.fetcher(url, {
			method: "PATCH",
			headers: {
				...this.authHeaders(),
				"Content-Type": "application/json",
			},
			body: JSON.stringify({fields}),
		});

		await assertOk(response, `patch ${path}`);
	}

	private authHeaders(): Record<string, string> {
		if (!this.accessToken) {
			return {};
		}

		return {
			Authorization: `Bearer ${this.accessToken}`,
		};
	}
}

function assignmentFromDocument(eventId: string, document: FirestoreDocument): AssignmentDocument {
	const fields = document.fields ?? {};
	return {
		id: documentId(document.name),
		eventId,
		teamNumber: stringField(fields.team_number),
		matchNumber: stringField(fields.match_number),
		scouterId: stringField(fields.scouter_id),
		scouterName: stringField(fields.scouter_name),
		notifiedAt: timestampField(fields.notified_at),
		nexusDataAsOfTime: numberField(fields.nexus_data_as_of_time),
		lastNexusStatus: nullableStringField(fields.last_nexus_status),
	};
}

function tokenFromDocument(document: FirestoreDocument): MessagingTokenDocument {
	const fields = document.fields ?? {};
	return {
		id: documentId(document.name),
		token: stringField(fields.token),
		provider: tokenProviderField(fields.provider),
		tokenType: stringField(fields.token_type),
		platform: stringField(fields.platform),
		disabledAt: timestampField(fields.disabled_at),
	};
}

function documentId(name: string) {
	return name.split("/").at(-1) ?? "";
}

function stringField(value?: FirestoreValue) {
	return value?.stringValue ?? "";
}

function nullableStringField(value?: FirestoreValue) {
	return value?.stringValue ?? null;
}

function timestampField(value?: FirestoreValue) {
	return value?.timestampValue ?? null;
}

function numberField(value?: FirestoreValue) {
	if (value?.integerValue !== undefined) {
		return Number(value.integerValue);
	}

	if (value?.doubleValue !== undefined) {
		return value.doubleValue;
	}

	return null;
}

function tokenProviderField(value?: FirestoreValue): MessagingTokenDocument["provider"] {
	const provider = value?.stringValue;

	if (provider === "expo" || provider === "native") {
		return provider;
	}

	return "unknown";
}

async function assertOk(response: Response, label: string) {
	if (!response.ok) {
		throw new Error(`Firestore ${label} failed with ${response.status}: ${await response.text()}`);
	}
}
