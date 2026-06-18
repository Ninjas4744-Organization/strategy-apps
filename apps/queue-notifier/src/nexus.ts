import type {
	AssignmentDocument,
	NexusLiveEventPayload,
	NexusMatch,
	PlannedNotification,
	QueueingTeam,
} from "./types";

const NOW_QUEUING_STATUS = "Now queuing";

export function isNexusLiveEventPayload(value: unknown): value is NexusLiveEventPayload {
	if (!value || typeof value !== "object") {
		return false;
	}

	const payload = value as Partial<NexusLiveEventPayload>;
	return (
		typeof payload.eventKey === "string" &&
		typeof payload.dataAsOfTime === "number" &&
		(payload.matches === undefined || Array.isArray(payload.matches))
	);
}

export function matchNumberFromLabel(label: string): string | null {
	const match = label.match(/\d+/);
	return match?.[0] ?? null;
}

export function findQueueingTeams(payload: NexusLiveEventPayload): QueueingTeam[] {
	const matches = payload.matches ?? [];
	const queueingMatches = matches.filter(match => isQueueingMatch(match, payload.nowQueuing ?? null));

	return queueingMatches.flatMap(match => {
		const matchNumber = matchNumberFromLabel(match.label);

		if (!matchNumber) {
			return [];
		}

		return [...(match.redTeams ?? []), ...(match.blueTeams ?? [])].map(teamNumber => ({
			matchLabel: match.label,
			matchNumber,
			teamNumber: teamNumber.toString(),
			status: match.status ?? NOW_QUEUING_STATUS,
		}));
	});
}

export function planNotifications(
	assignments: AssignmentDocument[],
	queueingTeams: QueueingTeam[],
): PlannedNotification[] {
	const queueingByMatchAndTeam = new Map(
		queueingTeams.map(team => [`${team.matchNumber}:${team.teamNumber}`, team]),
	);

	return assignments.flatMap(assignment => {
		if (assignment.notifiedAt) {
			return [];
		}

		const queueingTeam = queueingByMatchAndTeam.get(`${assignment.matchNumber}:${assignment.teamNumber}`);

		if (!queueingTeam) {
			return [];
		}

		return [{assignment, queueingTeam}];
	});
}

function isQueueingMatch(match: NexusMatch, nowQueuing: string | null) {
	if (match.status === NOW_QUEUING_STATUS) {
		return true;
	}

	return !!nowQueuing && match.label === nowQueuing;
}
