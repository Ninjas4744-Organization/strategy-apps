import type {
	AssignmentDocument,
	NexusLiveEventPayload,
	NexusCreatedMatchDocument,
	NexusMatchStatus,
	NexusMatch,
	NexusMatchType,
	PlannedNotification,
	QualificationScheduleSummary,
	QueueingTeam,
} from "./types";

const NOW_QUEUING_STATUS = "Now queuing";
const QUALIFICATION_MATCH_LABEL = /^Qualification\s+\d+$/i;
const PRACTICE_MATCH_LABEL = /^Practice\s+\d+$/i;

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
	const queueingMatches = matches.filter(match => isScheduledQualificationMatch(match) && isQueueingMatch(match, payload.nowQueuing ?? null));

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

	return scheduleSummaryFromMatches(qualificationMatches, payload.nowQueuing ?? null);
}

export function eventScheduleSummary(payload: NexusLiveEventPayload): QualificationScheduleSummary | null {
	const scheduledMatches = (payload.matches ?? [])
		.filter(isScheduledEventMatch)
		.sort((a, b) => {
			const typeCompare = matchTypeSortValue(a) - matchTypeSortValue(b);
			return typeCompare || Number(matchNumberFromLabel(a.label)) - Number(matchNumberFromLabel(b.label));
		});

	return scheduleSummaryFromMatches(scheduledMatches, payload.nowQueuing ?? null);
}

function scheduleSummaryFromMatches(matches: NexusMatch[], nowQueuing: string | null): QualificationScheduleSummary | null {
	if (matches.length === 0) {
		return null;
	}

	return {
		matchCount: matches.length,
		firstMatchLabel: matches[0].label,
		teams: teamsFromMatches(matches),
		matches: matches.map(match => matchFromNexus(match, nowQueuing)),
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
	return isScheduledMatchOfType(match, "qualification");
}

function isScheduledPracticeMatch(match: NexusMatch) {
	return isScheduledMatchOfType(match, "practice");
}

function isScheduledEventMatch(match: NexusMatch) {
	return isScheduledQualificationMatch(match) || isScheduledPracticeMatch(match);
}

function isScheduledMatchOfType(match: NexusMatch, type: NexusMatchType) {
	if (type === "qualification" && !QUALIFICATION_MATCH_LABEL.test(match.label)) {
		return false;
	}

	if (type === "practice" && !PRACTICE_MATCH_LABEL.test(match.label)) {
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

function matchFromNexus(match: NexusMatch, nowQueuing: string | null): NexusCreatedMatchDocument {
	const matchNumber = matchNumberFromLabel(match.label) ?? match.label;
	const matchType: NexusMatchType = PRACTICE_MATCH_LABEL.test(match.label) ? "practice" : "qualification";
	const nexusStatus = match.status ?? null;

	return {
		id: `${matchType}-${matchNumber}`,
		label: match.label,
		match_number: matchNumber,
		match_type: matchType,
		status: normalizeMatchStatus(nexusStatus, match.label, nowQueuing),
		nexus_status: nexusStatus,
		red_teams: teamsForMatchDoc(match.redTeams),
		blue_teams: teamsForMatchDoc(match.blueTeams),
		source: "nexus",
	};
}

export function normalizeMatchStatus(status: string | null | undefined, matchLabel: string, nowQueuing: string | null): NexusMatchStatus {
	const normalizedStatus = status?.trim().toLowerCase() ?? "";
	const matchPosition = scheduledMatchPosition(matchLabel);
	const nowQueuingPosition = nowQueuing ? scheduledMatchPosition(nowQueuing) : null;

	if (
		matchPosition &&
		nowQueuingPosition &&
		matchPosition.type === nowQueuingPosition.type
	) {
		if (matchPosition.number === nowQueuingPosition.number) {
			return "queued";
		}

		if (matchPosition.number < nowQueuingPosition.number) {
			if (normalizedStatus.includes("on field") && matchPosition.number === nowQueuingPosition.number - 1) {
				return "playing";
			}

			return "finished";
		}

		if (normalizedStatus.includes("on field")) {
			return "unknown";
		}
	}

	if (!normalizedStatus) {
		return "unknown";
	}

	if (
		normalizedStatus.includes("now queuing") ||
		normalizedStatus.includes("queue") ||
		normalizedStatus.includes("queu") ||
		normalizedStatus === "on deck"
	) {
		return "queued";
	}

	if (
		normalizedStatus.includes("on field") ||
		normalizedStatus.includes("playing") ||
		normalizedStatus.includes("in progress")
	) {
		return "playing";
	}

	if (
		normalizedStatus.includes("finished") ||
		normalizedStatus.includes("complete") ||
		normalizedStatus.includes("played")
	) {
		return "finished";
	}

	return "unknown";
}

function scheduledMatchPosition(label: string): {type: NexusMatchType; number: number} | null {
	const number = Number(matchNumberFromLabel(label));

	if (!Number.isFinite(number)) {
		return null;
	}

	if (QUALIFICATION_MATCH_LABEL.test(label)) {
		return {type: "qualification", number};
	}

	if (PRACTICE_MATCH_LABEL.test(label)) {
		return {type: "practice", number};
	}

	return null;
}

function matchTypeSortValue(match: NexusMatch) {
	return PRACTICE_MATCH_LABEL.test(match.label) ? 0 : 1;
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
