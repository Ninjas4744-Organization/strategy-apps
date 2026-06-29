import {readFileSync} from "node:fs";
import {applicationDefault, cert, initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

const usage = `
Usage:
  bun run firebase:update-user-email -- --current-email wrong@example.com --new-email right@example.com --apply
  bun run firebase:update-user-email -- --uid firebaseUid --new-email right@example.com --apply

Options:
  --current-email <email>  Look up the user by their current incorrect email.
  --uid <uid>             Look up the user by Firebase Auth UID.
  --new-email <email>     The corrected email address.
  --apply                 Actually update Firebase Auth. Without this, the script is a dry run.
  --verify-email          Mark the new email as verified.
  --project-id <id>       Firebase project id. Defaults to FIREBASE_PROJECT_ID or scouting-app-3e18a.

Credentials:
  Use GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json, or set
  FIREBASE_SERVICE_ACCOUNT_JSON to raw/base64 service account JSON.
`;

function parseArgs(argv) {
	const args = {
		apply: false,
		currentEmail: undefined,
		newEmail: undefined,
		projectId: process.env.FIREBASE_PROJECT_ID || "scouting-app-3e18a",
		uid: undefined,
		verifyEmail: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const readValue = () => {
			const value = argv[index + 1];
			if (!value || value.startsWith("--")) {
				throw new Error(`${arg} requires a value`);
			}
			index += 1;
			return value;
		};

		switch (arg) {
			case "--apply":
				args.apply = true;
				break;
			case "--current-email":
				args.currentEmail = readValue();
				break;
			case "--new-email":
				args.newEmail = readValue();
				break;
			case "--project-id":
				args.projectId = readValue();
				break;
			case "--uid":
				args.uid = readValue();
				break;
			case "--verify-email":
				args.verifyEmail = true;
				break;
			case "--help":
			case "-h":
				console.log(usage.trim());
				process.exit(0);
			default:
				throw new Error(`Unknown option: ${arg}`);
		}
	}

	return args;
}

function decodeServiceAccount(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("{")) {
		return JSON.parse(trimmed);
	}

	return JSON.parse(Buffer.from(trimmed, "base64").toString("utf8"));
}

function getCredential() {
	if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
		return cert(decodeServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
	}

	if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		return cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")));
	}

	return applicationDefault();
}

function assertValidArgs(args) {
	if (!args.uid && !args.currentEmail) {
		throw new Error("Provide either --uid or --current-email.");
	}

	if (args.uid && args.currentEmail) {
		throw new Error("Provide only one lookup option: --uid or --current-email.");
	}

	if (!args.newEmail) {
		throw new Error("Provide --new-email.");
	}
}

function formatUser(user) {
	return {
		uid: user.uid,
		email: user.email,
		emailVerified: user.emailVerified,
		disabled: user.disabled,
	};
}

const args = parseArgs(process.argv.slice(2));
assertValidArgs(args);

initializeApp({
	credential: getCredential(),
	projectId: args.projectId,
});

const auth = getAuth();
const user = args.uid
	? await auth.getUser(args.uid)
	: await auth.getUserByEmail(args.currentEmail);

console.log("Matched Firebase Auth user:");
console.log(JSON.stringify(formatUser(user), null, 2));

try {
	const existing = await auth.getUserByEmail(args.newEmail);
	if (existing.uid !== user.uid) {
		throw new Error(`Cannot update email: ${args.newEmail} already belongs to UID ${existing.uid}.`);
	}
} catch (error) {
	if (error?.code !== "auth/user-not-found") {
		throw error;
	}
}

if (!args.apply) {
	console.log("");
	console.log(`Dry run: would update ${user.uid} email to ${args.newEmail}. Add --apply to make the change.`);
	process.exit(0);
}

const updated = await auth.updateUser(user.uid, {
	email: args.newEmail,
	...(args.verifyEmail ? {emailVerified: true} : {}),
});

console.log("");
console.log("Updated Firebase Auth user:");
console.log(JSON.stringify(formatUser(updated), null, 2));
