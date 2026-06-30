import {readFileSync} from "node:fs";
import {applicationDefault, cert, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

const usage = `
Usage:
  GOOGLE_APPLICATION_CREDENTIALS=./service-account.json bun scripts/backfill-event-team-docs.mjs --event-id 2026demo
  GOOGLE_APPLICATION_CREDENTIALS=./service-account.json bun scripts/backfill-event-team-docs.mjs --event-id 2026demo --apply

Options:
  --event-id <id>     Limit backfill to one event.
  --project-id <id>   Firebase project id. Defaults to FIREBASE_PROJECT_ID or scouting-app-3e18a.
  --apply             Write missing team docs. Without this, the script is a dry run.

Credentials:
  Use GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json, or set
  FIREBASE_SERVICE_ACCOUNT_JSON to raw/base64 service account JSON.
`;

function parseArgs(argv) {
	const args = {
		apply: false,
		eventId: undefined,
		projectId: process.env.FIREBASE_PROJECT_ID || "scouting-app-3e18a",
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
			case "--event-id":
				args.eventId = readValue();
				break;
			case "--project-id":
				args.projectId = readValue();
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

function eventIdFromTeamRef(teamRef) {
	const eventRef = teamRef.parent.parent;
	return eventRef?.parent.id === "events" ? eventRef.id : undefined;
}

function addCandidate(candidates, eventId, teamNumber) {
	const normalizedTeamNumber = Number(teamNumber);
	if (!eventId || !Number.isFinite(normalizedTeamNumber) || normalizedTeamNumber <= 0) {
		return;
	}

	const key = `${eventId}/${normalizedTeamNumber}`;
	candidates.set(key, {eventId, teamNumber: normalizedTeamNumber});
}

async function addGameCandidates(db, candidates, collectionId, targetEventId) {
	const snapshot = await db.collectionGroup(collectionId).get();
	for (const gameDoc of snapshot.docs) {
		const teamRef = gameDoc.ref.parent.parent;
		if (!teamRef) {
			continue;
		}

		const eventId = eventIdFromTeamRef(teamRef);
		if (targetEventId && eventId !== targetEventId) {
			continue;
		}

		addCandidate(candidates, eventId, teamRef.id);
	}
}

async function addPitCandidates(db, candidates, targetEventId) {
	let eventsSnapshot;
	if (targetEventId) {
		const eventDoc = await db.collection("events").doc(targetEventId).get();
		eventsSnapshot = eventDoc.exists ? {docs: [eventDoc]} : {docs: []};
	} else {
		eventsSnapshot = await db.collection("events").get();
	}

	for (const eventDoc of eventsSnapshot.docs) {
		const pitSnapshot = await eventDoc.ref.collection("pit").get();
		for (const pitDoc of pitSnapshot.docs) {
			const teamNumber = pitDoc.get("team_number") ?? pitDoc.id;
			addCandidate(candidates, eventDoc.id, teamNumber);
		}
	}
}

async function findMissingTeamDocs(db, candidates) {
	const missing = [];
	for (const candidate of candidates.values()) {
		const teamRef = db.collection("events").doc(candidate.eventId).collection("teams").doc(candidate.teamNumber.toString());
		const teamSnap = await teamRef.get();
		if (!teamSnap.exists) {
			missing.push({...candidate, teamRef});
		}
	}
	return missing;
}

async function writeMissingTeamDocs(db, missing) {
	let batch = db.batch();
	let writesInBatch = 0;

	for (const item of missing) {
		batch.set(item.teamRef, {team_number: item.teamNumber}, {merge: true});
		writesInBatch += 1;

		if (writesInBatch === 450) {
			await batch.commit();
			batch = db.batch();
			writesInBatch = 0;
		}
	}

	if (writesInBatch > 0) {
		await batch.commit();
	}
}

const args = parseArgs(process.argv.slice(2));

initializeApp({
	credential: getCredential(),
	projectId: args.projectId,
});

const db = getFirestore();
const candidates = new Map();

await Promise.all([
	addGameCandidates(db, candidates, "games", args.eventId),
	addGameCandidates(db, candidates, "practiceGames", args.eventId),
	addPitCandidates(db, candidates, args.eventId),
]);

const missing = await findMissingTeamDocs(db, candidates);
const eventLabel = args.eventId ? `event ${args.eventId}` : "all events";

console.log(`Found ${candidates.size} team candidates from saved reports in ${eventLabel}.`);
console.log(`Missing ${missing.length} parent team docs.`);

for (const item of missing) {
	console.log(`- events/${item.eventId}/teams/${item.teamNumber}`);
}

if (!args.apply) {
	console.log("");
	console.log("Dry run only. Add --apply to create the missing parent team docs.");
	process.exit(0);
}

await writeMissingTeamDocs(db, missing);
console.log("");
console.log(`Created ${missing.length} missing parent team docs.`);
