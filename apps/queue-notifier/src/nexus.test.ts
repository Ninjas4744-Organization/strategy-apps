import {describe, expect, test} from "bun:test";
import {findQueueingTeams, matchNumberFromLabel, planNotifications} from "./nexus";
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
