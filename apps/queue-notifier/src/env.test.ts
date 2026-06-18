import {describe, expect, test} from "bun:test";
import {
	firebasePrivateKeyFromEnv,
	firestoreBaseUrlForEnv,
	firestoreEmulatorAccessTokenForEnv,
	usesFirestoreEmulator,
} from "./env";
import type {Env} from "./types";

describe("Worker env helpers", () => {
	test("builds Firestore emulator REST URL", () => {
		const env = baseEnv({FIRESTORE_EMULATOR_HOST: "127.0.0.1:4744"});

		expect(firestoreBaseUrlForEnv(env)).toBe(
			"http://127.0.0.1:4744/v1/projects/scouting-app-3e18a/databases/(default)/documents",
		);
		expect(usesFirestoreEmulator(env)).toBe(true);
	});

	test("keeps production Firestore URL by default", () => {
		const env = baseEnv();

		expect(firestoreBaseUrlForEnv(env)).toBe(
			"https://firestore.googleapis.com/v1/projects/scouting-app-3e18a/databases/(default)/documents",
		);
		expect(usesFirestoreEmulator(env)).toBe(false);
	});

	test("accepts raw escaped PEM and base64 private keys", () => {
		const pem = "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----";
		const decodedPem = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----";

		expect(firebasePrivateKeyFromEnv(pem)).toBe(decodedPem);
		expect(firebasePrivateKeyFromEnv(btoa(decodedPem))).toBe(decodedPem);
	});

	test("builds unsigned emulator auth tokens", () => {
		const token = firestoreEmulatorAccessTokenForEnv(baseEnv({FIRESTORE_EMULATOR_AUTH_UID: "local-worker-admin"}));
		const [header, payload, signature] = token?.split(".") ?? [];

		expect(JSON.parse(base64UrlDecode(header))).toMatchObject({alg: "none"});
		expect(JSON.parse(base64UrlDecode(payload))).toMatchObject({
			aud: "scouting-app-3e18a",
			sub: "local-worker-admin",
			user_id: "local-worker-admin",
		});
		expect(signature).toBe("");
	});
});

function baseEnv(overrides: Partial<Env> = {}): Env {
	return {
		FIREBASE_PROJECT_ID: "scouting-app-3e18a",
		NEXUS_WEBHOOK_TOKEN: "test-token",
		...overrides,
	};
}

function base64UrlDecode(value: string) {
	return atob(value.replaceAll("-", "+").replaceAll("_", "/"));
}
