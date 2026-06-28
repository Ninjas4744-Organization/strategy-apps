import {initializeApp} from "firebase/app";
import {
	connectAuthEmulator,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	connectFirestoreEmulator,
	doc,
	getFirestore,
	setDoc,
	Timestamp,
} from "firebase/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID || "scouting-app-3e18a";
const host = process.env.FIREBASE_EMULATOR_HOST || "127.0.0.1";
const firestorePort = Number(process.env.FIRESTORE_EMULATOR_PORT || 4744);
const authPort = Number(process.env.FIREBASE_AUTH_EMULATOR_PORT || 9099);

const app = initializeApp({
	apiKey: "demo-key",
	authDomain: `${projectId}.firebaseapp.com`,
	projectId,
	appId: "1:000000000000:web:demo",
});

const auth = getAuth(app);
connectAuthEmulator(auth, `http://${host}:${authPort}`, {disableWarnings: true});

const db = getFirestore(app);
connectFirestoreEmulator(db, host, firestorePort);

const users = [
	{
		email: "app-admin@ninja.local",
		password: "password123",
		profile: {name: "Ninja App Admin", team: 4744, type: "app_admin"},
	},
	{
		email: "admin@ninja.local",
		password: "password123",
		profile: {name: "Ninja Team Admin", team: 4744, type: "team_admin"},
	},
	{
		email: "scouter@ninja.local",
		password: "password123",
		profile: {name: "Ninja Scouter", team: 4744, type: "scouter"},
	},
	{
		email: "other-team@ninja.local",
		password: "password123",
		profile: {name: "Other Team Scouter", team: 1690, type: "scouter"},
	},
];

const events = [
	{
		id: "2025demo",
		data: {
			key: "2025demo",
			event_code: "demo",
			year: 2025,
			name: "Demo Reefscape Regional",
			start_date: "2025-03-14",
			end_date: "2025-03-16",
			country: "Israel",
			teams: ["frc4744", "frc1690", "frc1574", "frc2630"],
		},
	},
	{
		id: "2025isde1",
		data: {
			key: "2025isde1",
			event_code: "isde1",
			year: 2025,
			name: "Israel District Event 1",
			start_date: "2025-03-21",
			end_date: "2025-03-23",
			country: "Israel",
			teams: ["frc4744", "frc1690", "frc1574", "frc2630", "frc3339", "frc1943"],
		},
	},
];

const teams = [4744, 1690, 1574, 2630, 3339, 1943];

const pitDataByTeam = {
	4744: {team_number: 4744, drivetrain: "swerve", can_climb: true, has_processor: true},
	1690: {team_number: 1690, drivetrain: "swerve", can_climb: true, has_processor: false},
	1574: {team_number: 1574, drivetrain: "tank", can_climb: false, has_processor: true},
	2630: {team_number: 2630, drivetrain: "swerve", can_climb: true, has_processor: true},
	3339: {team_number: 3339, drivetrain: "tank", can_climb: false, has_processor: false},
	1943: {team_number: 1943, drivetrain: "swerve", can_climb: true, has_processor: false},
};

const gameTemplates = [
	{team: 4744, matches: [[1, 4, 2, 8, 5, "deep"], [4, 3, 3, 7, 6, "shallow"], [7, 5, 2, 9, 4, "deep"]]},
	{team: 1690, matches: [[1, 5, 3, 9, 7, "deep"], [5, 4, 2, 10, 5, "deep"], [8, 6, 3, 11, 6, "deep"]]},
	{team: 1574, matches: [[2, 2, 1, 5, 3, "park"], [5, 3, 1, 6, 2, "none"], [9, 2, 2, 6, 3, "park"]]},
	{team: 2630, matches: [[2, 3, 2, 7, 4, "shallow"], [6, 4, 3, 8, 5, "deep"], [9, 4, 2, 8, 6, "shallow"]]},
	{team: 3339, matches: [[3, 1, 1, 4, 2, "none"], [6, 2, 1, 4, 3, "park"], [10, 2, 1, 5, 2, "none"]]},
	{team: 1943, matches: [[3, 3, 2, 6, 4, "shallow"], [7, 3, 2, 7, 3, "park"], [10, 4, 2, 7, 4, "shallow"]]},
];

function qualificationMatchesForEvent(event, matchCount = 10) {
	const teamNumbers = event.data.teams.map(team => team.replace(/^frc/i, ""));

	return Array.from({length: matchCount}, (_, index) => {
		const rotatedTeams = Array.from({length: 6}, (__, offset) => teamNumbers[(index + offset) % teamNumbers.length]);
		const matchNumber = String(index + 1);

		return {
			id: matchNumber,
			data: {
				label: `Qualification ${matchNumber}`,
				match_number: matchNumber,
				red_teams: rotatedTeams.slice(0, 3),
				blue_teams: rotatedTeams.slice(3, 6),
				source: "seed",
				updated_at: Timestamp.fromDate(new Date(`${event.data.start_date}T08:00:00Z`)),
			},
		};
	});
}

function gameData(teamNumber, [match, autoL4, autoNet, teleL4, teleNet, cageLevel]) {
	return {
		team_number: String(teamNumber),
		game_number: String(match),
		autonomous_algae_net: autoNet,
		autonomous_algae_processed: 1,
		autonomous_net_missed: 1,
		autonomous_processed_missed: 0,
		autonomous_corals_scored_l4: autoL4,
		autonomous_corals_scored_l3: 1,
		autonomous_corals_scored_l2: 0,
		autonomous_corals_scored_l1: 0,
		autonomous_corals_missed_l4: 1,
		autonomous_corals_missed_l3: 0,
		autonomous_corals_missed_l2: 0,
		autonomous_corals_missed_l1: 0,
		algae_net: teleNet,
		algae_processed: 2,
		algae_net_missed: 1,
		algae_processed_missed: 0,
		corals_scored_l4: teleL4,
		corals_scored_l3: 2,
		corals_scored_l2: 1,
		corals_scored_l1: 0,
		corals_missed_l4: 1,
		corals_missed_l3: 1,
		corals_missed_l2: 0,
		corals_missed_l1: 0,
		cage_level: cageLevel,
		scouter_id: "seed",
		timestamp: Timestamp.fromDate(new Date(`2025-03-${14 + match}T10:00:00Z`)),
	};
}

async function upsertUser({email, password, profile}) {
	let credential;
	try {
		credential = await createUserWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (error?.code !== "auth/email-already-in-use") {
			throw error;
		}
		credential = await signInWithEmailAndPassword(auth, email, password);
	}

	await setDoc(doc(db, "users", credential.user.uid), profile);
	return credential.user.uid;
}

for (const user of users) {
	const uid = await upsertUser(user);
	console.log(`Seeded auth user ${user.email} (${uid})`);
}

await signInWithEmailAndPassword(auth, users[0].email, users[0].password);

await setDoc(doc(db, "registration_codes", "4744"), {
	members_code: "NINJA-SCOUT",
	admins_code: "NINJA-ADMIN",
});
await setDoc(doc(db, "registration_codes", "1690"), {
	members_code: "ORBIT-SCOUT",
	admins_code: "ORBIT-ADMIN",
});

for (const event of events) {
	await setDoc(doc(db, "events", event.id), event.data);

	for (const match of qualificationMatchesForEvent(event)) {
		await setDoc(doc(db, "events", event.id, "matches", match.id), match.data);
	}

	for (const team of teams) {
		if (!event.data.teams.includes(`frc${team}`)) {
			continue;
		}

		await setDoc(doc(db, "events", event.id, "teams", String(team)), {
			team_number: team,
		});

		await setDoc(doc(db, "events", event.id, "pit", String(team)), {
			...pitDataByTeam[team],
			scouter_id: "seed",
			timestamp: Timestamp.fromDate(new Date(`${event.data.start_date}T09:00:00Z`)),
		});
	}

	for (const template of gameTemplates) {
		if (!event.data.teams.includes(`frc${template.team}`)) {
			continue;
		}

		for (const match of template.matches) {
			await setDoc(
				doc(db, "events", event.id, "teams", String(template.team), "games", String(match[0])),
				gameData(template.team, match),
			);
		}
	}
}

console.log("");
console.log("Firebase emulator seed complete.");
console.log("Login accounts:");
for (const user of users) {
	console.log(`- ${user.email} / ${user.password} (${user.profile.type})`);
}

process.exit(0);
