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
	{
		id: "2026opponents",
		data: {
			key: "2026opponents",
			event_code: "opponents",
			year: 2026,
			name: "Next Opponents REBUILT Demo",
			start_date: "2026-03-28",
			end_date: "2026-03-30",
			country: "Israel",
			active: true,
			teams: ["frc4744", "frc1690", "frc1574", "frc2630", "frc3339", "frc1943"],
		},
	},
];

const teams = [4744, 1690, 1574, 2630, 3339, 1943];

const pitDataByTeam = {
	4744: {
		team_number: 4744,
		max_ball_capacity: 5,
		hopper_filling_efficiency: 1.8,
		goes_under_the_trench: true,
		goes_over_the_bump: true,
		where_does_it_collect_balls_in_auto: "Depot lane and center line",
		how_many_auto_types: 3,
		auto_types_description: "Two-ball score, trench pickup, and fast traversal auto",
		autonomous_notes: "Starts center, scores preload, collects from depot lane, then usually climbs if the lane is clear.",
		defense_notes: "Strong positional defender. Uses frame perimeter well, cuts passing lanes, and rarely draws contact fouls.",
		can_climb_in_auto: true,
		can_climb_to_level_3: true,
		climb_to_level_3_time: 8,
		can_climb_at_all: true,
		climb_time: 4,
		where_do_you_climb: "center",
	},
	1690: {
		team_number: 1690,
		max_ball_capacity: 6,
		hopper_filling_efficiency: 2.1,
		goes_under_the_trench: true,
		goes_over_the_bump: false,
		where_does_it_collect_balls_in_auto: "Outpost side",
		how_many_auto_types: 4,
		auto_types_description: "High-volume auto with center pickup fallback",
		autonomous_notes: "Very reliable high-volume auto. Prefers outpost-side pickup and can switch to a center fallback path.",
		defense_notes: "Fast enough to chase but usually avoids defense unless asked. Most effective as a counter-defender late.",
		can_climb_in_auto: false,
		can_climb_to_level_3: true,
		climb_to_level_3_time: 7,
		can_climb_at_all: true,
		climb_time: 3,
		where_do_you_climb: "right",
	},
	1574: {
		team_number: 1574,
		max_ball_capacity: 4,
		hopper_filling_efficiency: 1.4,
		goes_under_the_trench: false,
		goes_over_the_bump: true,
		where_does_it_collect_balls_in_auto: "Near-side depot",
		how_many_auto_types: 2,
		auto_types_description: "Simple taxi and one scoring auto",
		autonomous_notes: "Simple and consistent. Usually taxis, scores one preload, then parks near the protected lane.",
		defense_notes: "Heavy drivetrain and good at holding space. Slower recovery if they get turned around.",
		can_climb_in_auto: false,
		can_climb_to_level_3: false,
		climb_to_level_3_time: 0,
		can_climb_at_all: true,
		climb_time: 6,
		where_do_you_climb: "left",
	},
	2630: {
		team_number: 2630,
		max_ball_capacity: 5,
		hopper_filling_efficiency: 1.9,
		goes_under_the_trench: true,
		goes_over_the_bump: true,
		where_does_it_collect_balls_in_auto: "Middle field",
		how_many_auto_types: 3,
		auto_types_description: "Center pickup, protected-zone auto, and climb setup",
		autonomous_notes: "Aggressive middle-field auto with a climb setup option. Can interfere with nearby starting paths.",
		defense_notes: "Physical defender with quick lateral bumps. Watch for pinning near the hub entrance.",
		can_climb_in_auto: true,
		can_climb_to_level_3: true,
		climb_to_level_3_time: 9,
		can_climb_at_all: true,
		climb_time: 5,
		where_do_you_climb: "center",
	},
	3339: {
		team_number: 3339,
		max_ball_capacity: 3,
		hopper_filling_efficiency: 1.2,
		goes_under_the_trench: false,
		goes_over_the_bump: true,
		where_does_it_collect_balls_in_auto: "Depot only",
		how_many_auto_types: 1,
		auto_types_description: "Taxi and preload score",
		autonomous_notes: "Low-risk depot auto. Scores preload when aligned, otherwise prioritizes safe taxi points.",
		defense_notes: "Mostly passive defense. Blocks lanes when parked but struggles to keep up with faster cycles.",
		can_climb_in_auto: false,
		can_climb_to_level_3: false,
		climb_to_level_3_time: 0,
		can_climb_at_all: false,
		climb_time: 0,
		where_do_you_climb: "left",
	},
	1943: {
		team_number: 1943,
		max_ball_capacity: 5,
		hopper_filling_efficiency: 1.6,
		goes_under_the_trench: true,
		goes_over_the_bump: false,
		where_does_it_collect_balls_in_auto: "Outpost and wall-side line",
		how_many_auto_types: 2,
		auto_types_description: "Reliable two-ball and pass-heavy auto",
		autonomous_notes: "Reliable two-ball routine from the wall side. Often ends in a clean passing position.",
		defense_notes: "Smart shadow defender. Forces wide routes without overcommitting, especially against midfield cycles.",
		can_climb_in_auto: false,
		can_climb_to_level_3: true,
		climb_to_level_3_time: 10,
		can_climb_at_all: true,
		climb_time: 5,
		where_do_you_climb: "right",
	},
};

const gameTemplates = [
	{team: 4744, matches: [[1, 4, 2, 8, 5, "deep"], [4, 3, 3, 7, 6, "shallow"], [7, 5, 2, 9, 4, "deep"]]},
	{team: 1690, matches: [[1, 5, 3, 9, 7, "deep"], [5, 4, 2, 10, 5, "deep"], [8, 6, 3, 11, 6, "deep"]]},
	{team: 1574, matches: [[2, 2, 1, 5, 3, "park"], [5, 3, 1, 6, 2, "none"], [9, 2, 2, 6, 3, "park"]]},
	{team: 2630, matches: [[2, 3, 2, 7, 4, "shallow"], [6, 4, 3, 8, 5, "deep"], [9, 4, 2, 8, 6, "shallow"]]},
	{team: 3339, matches: [[3, 1, 1, 4, 2, "none"], [6, 2, 1, 4, 3, "park"], [10, 2, 1, 5, 2, "none"]]},
	{team: 1943, matches: [[3, 3, 2, 6, 4, "shallow"], [7, 3, 2, 7, 3, "park"], [10, 4, 2, 7, 4, "shallow"]]},
];

const rebuiltGameTemplates = [
	{team: 4744, matches: [[1, 82, 1, 76, 2, 64, 1, true, true, "Level 3"], [2, 78, 2, 72, 1, 61, 2, true, false, "Level 2"], [3, 86, 1, 80, 2, 67, 1, true, true, "Level 3"]]},
	{team: 1690, matches: [[1, 88, 0, 83, 1, 70, 1, false, true, "Level 3"], [2, 84, 1, 86, 1, 72, 0, false, true, "Level 3"], [3, 90, 1, 88, 1, 74, 1, false, true, "Level 3"]]},
	{team: 1574, matches: [[1, 60, 3, 58, 3, 42, 2, false, false, "Level 1"], [2, 64, 2, 55, 4, 44, 2, false, true, "Level 1"], [3, 61, 3, 57, 3, 40, 3, false, false, "None"]]},
	{team: 2630, matches: [[1, 75, 2, 73, 2, 58, 1, true, true, "Level 2"], [2, 80, 1, 77, 1, 62, 2, true, true, "Level 3"], [3, 79, 2, 75, 2, 60, 1, true, false, "Level 2"]]},
	{team: 3339, matches: [[1, 52, 4, 48, 4, 36, 3, false, false, "None"], [2, 55, 3, 50, 3, 38, 2, false, false, "Level 1"], [3, 50, 4, 46, 4, 34, 4, false, false, "None"]]},
	{team: 1943, matches: [[1, 68, 2, 64, 2, 52, 2, false, true, "Level 2"], [2, 70, 2, 66, 2, 55, 1, false, false, "Level 1"], [3, 72, 1, 68, 2, 56, 2, false, true, "Level 2"]]},
];

function scheduledMatchesForEvent(event, matchType, matchCount) {
	const teamNumbers = event.data.teams.map(team => team.replace(/^frc/i, ""));
	const labelPrefix = matchType === "practice" ? "Practice" : "Qualification";
	const statuses = matchType === "practice"
		? Array.from({length: matchCount}, () => ({status: "finished", nexusStatus: "Practice complete"}))
		: [
			{status: "finished", nexusStatus: "Match complete"},
			{status: "finished", nexusStatus: "Match complete"},
			{status: "finished", nexusStatus: "Match complete"},
			{status: "playing", nexusStatus: "On field"},
			{status: "queued", nexusStatus: "Now queuing"},
		];

	return Array.from({length: matchCount}, (_, index) => {
		const rotatedTeams = Array.from({length: 6}, (__, offset) => teamNumbers[(index + offset) % teamNumbers.length]);
		const matchNumber = String(index + 1);
		const matchStatus = statuses[index] ?? {status: "unknown", nexusStatus: null};

		return {
			id: `${matchType}-${matchNumber}`,
			data: {
				label: `${labelPrefix} ${matchNumber}`,
				match_number: matchNumber,
				match_type: matchType,
				status: matchStatus.status,
				nexus_status: matchStatus.nexusStatus,
				red_teams: rotatedTeams.slice(0, 3),
				blue_teams: rotatedTeams.slice(3, 6),
				source: "seed",
				updated_at: Timestamp.fromDate(new Date(`${event.data.start_date}T08:00:00Z`)),
			},
		};
	});
}

function qualificationMatchesForEvent(event, matchCount = 10) {
	return scheduledMatchesForEvent(event, "qualification", matchCount);
}

function practiceMatchesForEvent(event, matchCount = 4) {
	return scheduledMatchesForEvent(event, "practice", matchCount);
}

function gameData(teamNumber, [match, autoL4, autoNet, teleL4, teleNet, cageLevel]) {
	return {
		team_number: String(teamNumber),
		game_number: String(match),
		match_type: "qualification",
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

function shotBatch(shotPct, missCount) {
	return [{shotPct, missCount}];
}

function rebuiltGameData(teamNumber, [match, autoPct, autoMisses, telePct, teleMisses, endgamePct, endgameMisses, autonomousClimb, wonAuto, traversalLevel]) {
	return {
		team_number: String(teamNumber),
		game_number: String(match),
		match_type: "qualification",
		autonomous_fuel_scored: shotBatch(autoPct, autoMisses),
		autonomous_fuel_passed: wonAuto ? 5 : 3,
		autonomous_climb: autonomousClimb,
		won_auto: wonAuto,
		teleop_fuel_scored: shotBatch(telePct, teleMisses),
		teleop_fuel_passed: wonAuto ? 15 : 10,
		teleop_fuel_passed_inactive: wonAuto ? 4 : 8,
		endgame_fuel_scored: shotBatch(endgamePct, endgameMisses),
		endgame_fuel_passed: 5,
		traversal_level: traversalLevel,
		cage_level: traversalLevel,
		scouter_id: "seed",
		report_type: "seeded_match_report",
		timestamp: Timestamp.fromDate(new Date(`2026-03-${14 + match}T10:00:00Z`)),
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

	for (const match of [...practiceMatchesForEvent(event), ...qualificationMatchesForEvent(event)]) {
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

	const eventGameTemplates = event.data.year === 2026 ? rebuiltGameTemplates : gameTemplates;
	const eventGameData = event.data.year === 2026 ? rebuiltGameData : gameData;

	for (const template of eventGameTemplates) {
		if (!event.data.teams.includes(`frc${template.team}`)) {
			continue;
		}

		for (const match of template.matches) {
			await setDoc(
				doc(db, "events", event.id, "teams", String(template.team), "games", String(match[0])),
				eventGameData(template.team, match),
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
