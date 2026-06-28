import {describe, expect, test} from "bun:test";
import {eventScheduleSummary, findQueueingTeams, matchNumberFromLabel, normalizeMatchStatus, planNotifications, qualificationScheduleSummary} from "./nexus";
import type {AssignmentDocument, NexusLiveEventPayload} from "./types";

describe("Nexus queue notification planning", () => {
	test("extracts match numbers from Nexus labels", () => {
		expect(matchNumberFromLabel("Qualification 24")).toBe("24");
		expect(matchNumberFromLabel("Qualification 24 Replay")).toBe("24");
		expect(matchNumberFromLabel("Final 1")).toBe("1");
		expect(matchNumberFromLabel("Practice")).toBeNull();
	});

	test("finds teams from matches with Now queuing status", () => {
		const payload: NexusLiveEventPayload = {
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			nowQueuing: "Qualification 24",
			matches: [
				{
					label: "Qualification 24",
					status: "Now queuing",
					redTeams: ["4744", "1690", "1574"],
					blueTeams: ["3339", "4590", "5654"],
				},
				{
					label: "Qualification 25",
					status: "On deck",
					redTeams: ["1"],
					blueTeams: ["2"],
				},
			],
		};

		expect(findQueueingTeams(payload)).toEqual([
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "4744", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "1690", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "1574", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "3339", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "4590", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "5654", status: "Now queuing"},
		]);
	});

	test("does not send assignment notifications for practice queueing", () => {
		expect(findQueueingTeams({
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			nowQueuing: "Practice 1",
			matches: [
				{
					label: "Practice 1",
					status: "Now queuing",
					redTeams: ["4744"],
					blueTeams: ["1690"],
				},
			],
		})).toEqual([]);
	});

	test("plans notifications only for unnotified matching assignments", () => {
		const queueingTeams = [
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "4744", status: "Now queuing"},
			{matchLabel: "Qualification 24", matchNumber: "24", teamNumber: "1690", status: "Now queuing"},
		];
		const assignments: AssignmentDocument[] = [
			assignment({id: "match-24-team-4744", matchNumber: "24", teamNumber: "4744", notifiedAt: null}),
			assignment({id: "match-24-team-1690", matchNumber: "24", teamNumber: "1690", notifiedAt: "2026-01-01T00:00:00.000Z"}),
			assignment({id: "match-25-team-4744", matchNumber: "25", teamNumber: "4744", notifiedAt: null}),
		];

		expect(planNotifications(assignments, queueingTeams).map(plan => plan.assignment.id)).toEqual([
			"match-24-team-4744",
		]);
	});

	test("detects qualification schedule release from scheduled qualification matches", () => {
		const payload: NexusLiveEventPayload = {
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			matches: [
				{
					label: "Qualification 1",
					status: "Queuing soon",
					redTeams: ["4744", "1690", "1574"],
					blueTeams: ["3339", "4590", "5654"],
				},
				{
					label: "Qualification 2",
					status: "Queuing soon",
					redTeams: ["1"],
					blueTeams: ["2"],
				},
				{
					label: "Playoff 1",
					status: "Queuing soon",
					redTeams: ["3"],
					blueTeams: ["4"],
				},
			],
		};

		expect(qualificationScheduleSummary(payload)).toEqual({
			matchCount: 2,
			firstMatchLabel: "Qualification 1",
			teams: ["frc1", "frc2", "frc1574", "frc1690", "frc3339", "frc4590", "frc4744", "frc5654"],
			matches: [
				{
					id: "qualification-1",
					label: "Qualification 1",
					match_number: "1",
					match_type: "qualification",
					status: "queued",
					nexus_status: "Queuing soon",
					red_teams: ["4744", "1690", "1574"],
					blue_teams: ["3339", "4590", "5654"],
					source: "nexus",
				},
				{
					id: "qualification-2",
					label: "Qualification 2",
					match_number: "2",
					match_type: "qualification",
					status: "queued",
					nexus_status: "Queuing soon",
					red_teams: ["1"],
					blue_teams: ["2"],
					source: "nexus",
				},
			],
		});
	});

	test("does not detect schedule release without normal qualification matches", () => {
		expect(qualificationScheduleSummary({
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			matches: [],
		})).toBeNull();

		expect(qualificationScheduleSummary({
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			matches: [
				{
					label: "Qualification 2 Replay",
					status: "Queuing soon",
					redTeams: ["1"],
					blueTeams: ["2"],
				},
			],
		})).toBeNull();
	});

	test("detects practice schedules for event creation without treating them as qualifications", () => {
		const payload: NexusLiveEventPayload = {
			eventKey: "2025isde1",
			dataAsOfTime: 1,
			matches: [
				{
					label: "Practice 1",
					status: "Queuing soon",
					redTeams: ["4744", "1690", "1574"],
					blueTeams: ["3339", "4590", "5654"],
				},
				{
					label: "Qualification 1",
					status: "Queuing soon",
					redTeams: ["1"],
					blueTeams: ["2"],
				},
			],
		};

		expect(eventScheduleSummary(payload)).toEqual({
			matchCount: 2,
			firstMatchLabel: "Practice 1",
			teams: ["frc1", "frc2", "frc1574", "frc1690", "frc3339", "frc4590", "frc4744", "frc5654"],
			matches: [
				{
					id: "practice-1",
					label: "Practice 1",
					match_number: "1",
					match_type: "practice",
					status: "queued",
					nexus_status: "Queuing soon",
					red_teams: ["4744", "1690", "1574"],
					blue_teams: ["3339", "4590", "5654"],
					source: "nexus",
				},
				{
					id: "qualification-1",
					label: "Qualification 1",
					match_number: "1",
					match_type: "qualification",
					status: "queued",
					nexus_status: "Queuing soon",
					red_teams: ["1"],
					blue_teams: ["2"],
					source: "nexus",
				},
			],
		});
		expect(qualificationScheduleSummary({
			...payload,
			matches: payload.matches?.filter(match => match.label.startsWith("Practice")),
		})).toBeNull();
	});

	test("normalizes Nexus match statuses for match cards", () => {
		expect(normalizeMatchStatus("Now queuing", "Qualification 1", null)).toBe("queued");
		expect(normalizeMatchStatus("On deck", "Qualification 1", null)).toBe("queued");
		expect(normalizeMatchStatus(null, "Qualification 1", "Qualification 1")).toBe("queued");
		expect(normalizeMatchStatus("On field", "Qualification 1", null)).toBe("playing");
		expect(normalizeMatchStatus("Match complete", "Qualification 1", null)).toBe("finished");
		expect(normalizeMatchStatus(null, "Qualification 1", null)).toBe("unknown");
	});

	test("infers finished matches from the currently queueing match", () => {
		expect(normalizeMatchStatus("On field", "Qualification 21", "Qualification 24")).toBe("finished");
		expect(normalizeMatchStatus("On field", "Qualification 23", "Qualification 24")).toBe("playing");
		expect(normalizeMatchStatus("On field", "Qualification 24", "Qualification 24")).toBe("queued");
		expect(normalizeMatchStatus("On field", "Qualification 25", "Qualification 24")).toBe("unknown");
		expect(normalizeMatchStatus("On field", "Practice 1", "Qualification 24")).toBe("playing");
	});
});

function assignment(overrides: Partial<AssignmentDocument>): AssignmentDocument {
	return {
		id: "assignment",
		eventId: "2025isde1",
		teamNumber: "4744",
		matchNumber: "1",
		scouterId: "scouter-1",
		scouterName: "Scout",
		notifiedAt: null,
		nexusDataAsOfTime: null,
		lastNexusStatus: null,
		...overrides,
	};
}
