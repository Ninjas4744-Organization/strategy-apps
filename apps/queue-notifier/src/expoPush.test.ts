import {describe, expect, test} from "bun:test";
import {buildExpoMessage, buildTestExpoMessage, sendPushNotifications, sendTestPushNotifications} from "./expoPush";
import type {MessagingTokenDocument, PlannedNotification} from "./types";

describe("Expo push notifications", () => {
	test("builds queue assignment messages", () => {
		const message = buildExpoMessage(plan(), "ExponentPushToken[test]");

		expect(message).toMatchObject({
			to: "ExponentPushToken[test]",
			title: "Queueing: Match 24",
			data: {
				type: "queueing-assignment",
				eventId: "2025isde1",
				assignmentId: "match-24-team-4744",
				teamNumber: "4744",
			},
		});
	});

	test("builds manual test messages", () => {
		const message = buildTestExpoMessage(plan(), "ExponentPushToken[test]");

		expect(message).toMatchObject({
			to: "ExponentPushToken[test]",
			title: "Test: Match 24",
			data: {
				type: "test-queueing-assignment",
				eventId: "2025isde1",
				assignmentId: "match-24-team-4744",
				teamNumber: "4744",
			},
		});
	});

	test("sends expo tokens and skips native tokens for now", async () => {
		const requests: unknown[] = [];
		const result = await sendPushNotifications(
			plan(),
			[
				token({id: "expo", provider: "expo", token: "ExponentPushToken[test]"}),
				token({id: "native", provider: "native", token: "native-token"}),
				token({id: "disabled", provider: "expo", token: "disabled", disabledAt: "2026-01-01T00:00:00.000Z"}),
			],
			async (_url, init) => {
				requests.push(JSON.parse(init?.body?.toString() ?? "null"));
				return new Response(JSON.stringify({data: [{status: "ok"}]}), {status: 200});
			},
		);

		expect(result).toEqual({sent: 1, skippedNative: 1, errors: []});
		expect(requests).toHaveLength(1);
		expect(requests[0]).toEqual([buildExpoMessage(plan(), "ExponentPushToken[test]")]);
	});

	test("sends manual test notification messages", async () => {
		const requests: unknown[] = [];
		const result = await sendTestPushNotifications(
			plan(),
			[token({id: "expo", provider: "expo", token: "ExponentPushToken[test]"})],
			async (_url, init) => {
				requests.push(JSON.parse(init?.body?.toString() ?? "null"));
				return new Response(JSON.stringify({data: [{status: "ok"}]}), {status: 200});
			},
		);

		expect(result).toEqual({sent: 1, skippedNative: 0, errors: []});
		expect(requests).toEqual([[buildTestExpoMessage(plan(), "ExponentPushToken[test]")]]);
	});
});

function plan(): PlannedNotification {
	return {
		assignment: {
			id: "match-24-team-4744",
			eventId: "2025isde1",
			teamNumber: "4744",
			matchNumber: "24",
			scouterId: "scouter-1",
			scouterName: "Scout",
			notifiedAt: null,
			nexusDataAsOfTime: null,
			lastNexusStatus: null,
		},
		queueingTeam: {
			matchLabel: "Qualification 24",
			matchNumber: "24",
			teamNumber: "4744",
			status: "Now queuing",
		},
	};
}

function token(overrides: Partial<MessagingTokenDocument>): MessagingTokenDocument {
	return {
		id: "token",
		token: "token",
		provider: "expo",
		tokenType: "expo",
		platform: "ios",
		disabledAt: null,
		...overrides,
	};
}
