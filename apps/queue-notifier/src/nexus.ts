import type {
	AssignmentDocument,
	NexusLiveEventPayload,
	NexusCreatedMatchDocument,
	NexusMatch,
	PlannedNotification,
	QualificationScheduleSummary,
	QueueingTeam,
} from "./types";

const NOW_QUEUING_STATUS = "Now queuing";
const QUALIFICATION_MATCH_LABEL = /^Qualification\s+\d+$/i;

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

export function qualificationScheduleSummary(payload: NexusLiveEventPayload): QualificationScheduleSummary | null {
	const qualificationMatches = (payload.matches ?? [])
		.filter(isScheduledQualificationMatch)
		.sort((a, b) => Number(matchNumberFromLabel(a.label)) - Number(matchNumberFromLabel(b.label)));

	if (qualificationMatches.length === 0) {
		return null;
	}

	return {
		matchCount: qualificationMatches.length,
		firstMatchLabel: qualificationMatches[0].label,
		teams: teamsFromMatches(qualificationMatches),
		matches: qualificationMatches.map(matchFromNexus),
	};
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

function isScheduledQualificationMatch(match: NexusMatch) {
	if (!QUALIFICATION_MATCH_LABEL.test(match.label)) {
		return false;
	}

	return [...(match.redTeams ?? []), ...(match.blueTeams ?? [])].length > 0;
}

function teamsFromMatches(matches: NexusMatch[]) {
	const teams = new Set<string>();

	for (const match of matches) {
		for (const teamNumber of [...(match.redTeams ?? []), ...(match.blueTeams ?? [])]) {
			const normalizedTeam = teamNumber.toString().trim();

			if (normalizedTeam) {
				teams.add(normalizedTeam.startsWith("frc") ? normalizedTeam : `frc${normalizedTeam}`);
			}
		}
	}

	return [...teams].sort((a, b) => Number(a.replace("frc", "")) - Number(b.replace("frc", "")));
}

function matchFromNexus(match: NexusMatch): NexusCreatedMatchDocument {
	const matchNumber = matchNumberFromLabel(match.label) ?? match.label;

	return {
		id: matchNumber,
		label: match.label,
		match_number: matchNumber,
		red_teams: teamsForMatchDoc(match.redTeams),
		blue_teams: teamsForMatchDoc(match.blueTeams),
		source: "nexus",
	};
}

function teamsForMatchDoc(teams: string[] | undefined) {
	return (teams ?? [])
		.map(team => team.toString().replace(/^frc/i, "").trim())
		.filter(Boolean);
}

function isQueueingMatch(match: NexusMatch, nowQueuing: string | null) {
	if (match.status === NOW_QUEUING_STATUS) {
		return true;
	}

	return !!nowQueuing && match.label === nowQueuing;
}
