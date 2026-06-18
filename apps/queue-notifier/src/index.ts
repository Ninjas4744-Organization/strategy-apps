import {sendPushNotifications, sendTestPushNotifications} from "./expoPush";
import {
	firebasePrivateKeyFromEnv,
	firestoreBaseUrlForEnv,
	firestoreEmulatorAccessTokenForEnv,
	usesFirestoreEmulator,
} from "./env";
import {FirestoreRestClient} from "./firestoreRest";
import {getGoogleAccessToken} from "./googleAuth";
import {findQueueingTeams, isNexusLiveEventPayload, planNotifications} from "./nexus";
import type {Env, NexusLiveEventPayload, TestNotificationPayload} from "./types";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "GET" && url.pathname === "/health") {
			return Response.json({ok: true});
		}

		if (request.method === "POST" && url.pathname === "/nexus/live-event") {
			return await handleNexusLiveEvent(request, env);
		}

		if (request.method === "POST" && url.pathname === "/admin/test-notification") {
			return await handleTestNotification(request, env);
		}

		return Response.json({error: "Not found"}, {status: 404});
	},
};

async function handleNexusLiveEvent(request: Request, env: Env) {
	const tokenResponse = verifyRequestToken(request, env);
	if (tokenResponse) {
		return tokenResponse;
	}

	let rawPayload: unknown;

	try {
		rawPayload = await request.json();
	} catch {
		return Response.json({error: "Invalid JSON body"}, {status: 400});
	}

	if (!isNexusLiveEventPayload(rawPayload)) {
		return Response.json({error: "Invalid Nexus live event payload"}, {status: 400});
	}

	const payload = rawPayload as NexusLiveEventPayload;
	const accessToken = await getFirestoreAccessToken(env);
	const firestore = new FirestoreRestClient(
		env.FIREBASE_PROJECT_ID,
		accessToken,
		globalThis.fetch.bind(globalThis),
		firestoreBaseUrlForEnv(env),
	);
	const previousState = await firestore.getNexusEventState(payload.eventKey);

	if (previousState?.lastDataAsOfTime !== null && previousState?.lastDataAsOfTime !== undefined) {
		if (previousState.lastDataAsOfTime >= payload.dataAsOfTime) {
			return Response.json({
				ok: true,
				ignored: true,
				reason: "stale_payload",
				eventKey: payload.eventKey,
				dataAsOfTime: payload.dataAsOfTime,
				lastDataAsOfTime: previousState.lastDataAsOfTime,
			});
		}
	}

	const queueingTeams = findQueueingTeams(payload);
	const assignments = await firestore.listAssignments(payload.eventKey);
	const plans = planNotifications(assignments, queueingTeams);
	const results = [];

	for (const plan of plans) {
		const tokens = await firestore.listMessagingTokens(plan.assignment.scouterId);
		const sendResult = await sendPushNotifications(plan, tokens);
		const resultText = [
			`expo_sent:${sendResult.sent}`,
			`native_skipped:${sendResult.skippedNative}`,
		].join(" ");
		const errorText = sendResult.errors.length > 0 ? sendResult.errors.join("\n") : null;

		await firestore.markAssignmentNotificationResult(payload.eventKey, plan.assignment.id, {
			dataAsOfTime: payload.dataAsOfTime,
			status: plan.queueingTeam.status,
			result: resultText,
			error: errorText,
			wasSent: sendResult.sent > 0,
		});

		results.push({
			assignmentId: plan.assignment.id,
			scouterId: plan.assignment.scouterId,
			matchNumber: plan.assignment.matchNumber,
			teamNumber: plan.assignment.teamNumber,
			...sendResult,
		});
	}

	await firestore.setNexusEventState(payload.eventKey, payload.dataAsOfTime);

	console.log("Processed Nexus live event", {
		eventKey: payload.eventKey,
		dataAsOfTime: payload.dataAsOfTime,
		queueingTeamCount: queueingTeams.length,
		assignmentCount: assignments.length,
		notificationCount: plans.length,
	});

	return Response.json({
		ok: true,
		eventKey: payload.eventKey,
		dataAsOfTime: payload.dataAsOfTime,
		queueingTeamCount: queueingTeams.length,
		assignmentCount: assignments.length,
		notificationCount: plans.length,
		results,
	});
}

async function handleTestNotification(request: Request, env: Env) {
	const tokenResponse = verifyRequestToken(request, env);
	if (tokenResponse) {
		return tokenResponse;
	}

	let rawPayload: unknown;

	try {
		rawPayload = await request.json();
	} catch {
		return Response.json({error: "Invalid JSON body"}, {status: 400});
	}

	if (!isTestNotificationPayload(rawPayload)) {
		return Response.json({error: "Expected eventId and assignmentId string fields"}, {status: 400});
	}

	const payload = rawPayload as TestNotificationPayload;
	const accessToken = await getFirestoreAccessToken(env);
	const firestore = new FirestoreRestClient(
		env.FIREBASE_PROJECT_ID,
		accessToken,
		globalThis.fetch.bind(globalThis),
		firestoreBaseUrlForEnv(env),
	);
	const assignment = await firestore.getAssignment(payload.eventId, payload.assignmentId);

	if (!assignment) {
		return Response.json({error: "Assignment not found"}, {status: 404});
	}

	const tokens = await firestore.listMessagingTokens(assignment.scouterId);
	const sendResult = await sendTestPushNotifications({
		assignment,
		queueingTeam: {
			matchLabel: `Match ${assignment.matchNumber}`,
			matchNumber: assignment.matchNumber,
			teamNumber: assignment.teamNumber,
			status: "Manual test",
		},
	}, tokens);

	console.log("Processed manual test notification", {
		eventId: payload.eventId,
		assignmentId: payload.assignmentId,
		scouterId: assignment.scouterId,
		tokenCount: tokens.length,
		...sendResult,
	});

	return Response.json({
		ok: true,
		eventId: payload.eventId,
		assignmentId: payload.assignmentId,
		scouterId: assignment.scouterId,
		tokenCount: tokens.length,
		...sendResult,
	});
}

function verifyRequestToken(request: Request, env: Env) {
	const expectedToken = env.NEXUS_WEBHOOK_TOKEN;

	if (!expectedToken) {
		return Response.json({error: "NEXUS_WEBHOOK_TOKEN is not configured"}, {status: 500});
	}

	if (request.headers.get("Nexus-Token") !== expectedToken) {
		return Response.json({error: "Invalid Nexus token"}, {status: 401});
	}

	return null;
}

function isTestNotificationPayload(value: unknown): value is TestNotificationPayload {
	if (!value || typeof value !== "object") {
		return false;
	}

	const payload = value as Partial<TestNotificationPayload>;
	return typeof payload.eventId === "string"
		&& payload.eventId.length > 0
		&& typeof payload.assignmentId === "string"
		&& payload.assignmentId.length > 0;
}

async function getFirestoreAccessToken(env: Env) {
	if (usesFirestoreEmulator(env)) {
		return firestoreEmulatorAccessTokenForEnv(env);
	}

	if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
		throw new Error("FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are required outside the Firestore emulator");
	}

	return await getGoogleAccessToken(
		env.FIREBASE_CLIENT_EMAIL,
		firebasePrivateKeyFromEnv(env.FIREBASE_PRIVATE_KEY),
	);
}
