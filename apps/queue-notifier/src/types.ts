export type Env = {
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_EMAIL?: string;
	FIREBASE_PRIVATE_KEY?: string;
	FIRESTORE_EMULATOR_HOST?: string;
	FIRESTORE_EMULATOR_AUTH_UID?: string;
	FIRESTORE_BASE_URL?: string;
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
