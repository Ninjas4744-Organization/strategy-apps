export type Env = {
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_EMAIL?: string;
	FIREBASE_PRIVATE_KEY?: string;
	FIRESTORE_EMULATOR_HOST?: string;
	FIRESTORE_EMULATOR_AUTH_UID?: string;
	FIRESTORE_BASE_URL?: string;
	NEXUS_API_KEY?: string;
	NEXUS_WEBHOOK_TOKEN: string;
};

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type NexusMatch = {
	label: string;
	status?: string | null;
	redTeams?: string[];
	blueTeams?: string[];
};

export type NexusLiveEventPayload = {
	eventKey: string;
	dataAsOfTime: number;
	nowQueuing?: string | null;
	matches?: NexusMatch[];
};

export type TestNotificationPayload = {
	eventId: string;
	assignmentId: string;
};

export type NexusEventState = {
	lastDataAsOfTime: number | null;
	qualificationScheduleReleasedAt: string | null;
	qualificationScheduleReleaseDataAsOfTime: number | null;
	qualificationScheduleMatchCount: number | null;
};

export type NexusMatchType = "qualification" | "practice";
export type NexusMatchStatus = "queued" | "playing" | "finished" | "unknown";

export type QualificationScheduleSummary = {
	matchCount: number;
	firstMatchLabel: string;
	teams: string[];
	matches: NexusCreatedMatchDocument[];
};

export type NexusCreatedEventDocument = {
	key: string;
	name: string;
	event_code: string;
	event_type: number;
	city: string | null;
	state_prov: string | null;
	country: string;
	start_date: string;
	end_date: string;
	year: number;
	teams: string[];
	active: boolean;
};

export type NexusCreatedMatchDocument = {
	id: string;
	label: string;
	match_number: string;
	match_type: NexusMatchType;
	status: NexusMatchStatus;
	nexus_status: string | null;
	red_teams: string[];
	blue_teams: string[];
	source: "nexus";
};

export type AssignmentDocument = {
	id: string;
	eventId: string;
	teamNumber: string;
	matchNumber: string;
	scouterId: string;
	scouterName: string;
	notifiedAt: string | null;
	nexusDataAsOfTime: number | null;
	lastNexusStatus: string | null;
};

export type MessagingTokenDocument = {
	id: string;
	token: string;
	provider: "expo" | "native" | "unknown";
	tokenType: string;
	platform: string;
	disabledAt: string | null;
};

export type QueueingTeam = {
	matchLabel: string;
	matchNumber: string;
	teamNumber: string;
	status: string;
};

export type PlannedNotification = {
	assignment: AssignmentDocument;
	queueingTeam: QueueingTeam;
};

export type SendResult = {
	sent: number;
	skippedNative: number;
	errors: string[];
};
