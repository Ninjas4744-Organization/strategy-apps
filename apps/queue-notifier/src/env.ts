import type {Env} from "./types";

export function firestoreBaseUrlForEnv(env: Env) {
	if (env.FIRESTORE_BASE_URL) {
		return trimTrailingSlashes(env.FIRESTORE_BASE_URL);
	}

	if (env.FIRESTORE_EMULATOR_HOST) {
		return `http://${env.FIRESTORE_EMULATOR_HOST}/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
	}

	return `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
}

export function usesFirestoreEmulator(env: Env) {
	return Boolean(env.FIRESTORE_EMULATOR_HOST || env.FIRESTORE_BASE_URL?.startsWith("http://"));
}

export function firebasePrivateKeyFromEnv(privateKey: string) {
	const trimmed = privateKey.trim();

	if (trimmed.includes("BEGIN PRIVATE KEY")) {
		return trimmed.replace(/\\n/g, "\n");
	}

	return atob(trimmed);
}

export function firestoreEmulatorAccessTokenForEnv(env: Env) {
	if (!env.FIRESTORE_EMULATOR_AUTH_UID) {
		return null;
	}

	const nowInSeconds = Math.floor(Date.now() / 1000);
	const uid = env.FIRESTORE_EMULATOR_AUTH_UID;
	const header = {
		alg: "none",
		typ: "JWT",
	};
	const payload = {
		aud: env.FIREBASE_PROJECT_ID,
		auth_time: nowInSeconds,
		exp: nowInSeconds + 3600,
		firebase: {
			identities: {},
			sign_in_provider: "custom",
		},
		iat: nowInSeconds,
		iss: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
		sub: uid,
		user_id: uid,
	};

	return `${base64UrlJson(header)}.${base64UrlJson(payload)}.`;
}

function trimTrailingSlashes(value: string) {
	return value.replace(/\/+$/, "");
}

function base64UrlJson(value: unknown) {
	return btoa(JSON.stringify(value))
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replaceAll("=", "");
}
