import type {MessagingTokenDocument, PlannedNotification, SendResult} from "./types";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export function buildExpoMessage(plan: PlannedNotification, token: string) {
	return {
		to: token,
		sound: "default",
		title: `Queueing: Match ${plan.assignment.matchNumber}`,
		body: `Team ${plan.assignment.teamNumber} is queueing. Scout ${plan.assignment.scouterName}'s assignment now.`,
		data: {
			type: "queueing-assignment",
			eventId: plan.assignment.eventId,
			assignmentId: plan.assignment.id,
			matchNumber: plan.assignment.matchNumber,
			matchLabel: plan.queueingTeam.matchLabel,
			teamNumber: plan.assignment.teamNumber,
		},
	};
}

export async function sendPushNotifications(
	plan: PlannedNotification,
	tokens: MessagingTokenDocument[],
	fetcher: typeof fetch = fetch,
): Promise<SendResult> {
	const activeTokens = tokens.filter(token => !token.disabledAt);
	const expoTokens = activeTokens.filter(token => token.provider === "expo");
	const nativeTokens = activeTokens.filter(token => token.provider === "native");
	const errors: string[] = [];

	if (expoTokens.length > 0) {
		const response = await fetcher(EXPO_PUSH_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(expoTokens.map(token => buildExpoMessage(plan, token.token))),
		});

		if (!response.ok) {
			errors.push(`Expo push failed with ${response.status}: ${await response.text()}`);
		}
	}

	return {
		sent: errors.length > 0 ? 0 : expoTokens.length,
		skippedNative: nativeTokens.length,
		errors,
	};
}
