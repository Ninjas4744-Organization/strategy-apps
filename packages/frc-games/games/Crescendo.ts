import type {FRCGame} from "../types";
import {MD2Colors} from "react-native-paper";
import {Game} from "../calculations";

enum StageResult {
	NONE = "none",
	PARK = "park",
	CLIMB = "climb",
	SPOTLIT = "spotlit",
}

export const Crescendo: FRCGame = {
	sections: [
		{
			color: MD2Colors.orange500,
			title: "Autonomous Scoring",
			icon: "auto-awesome",
			phase: "autonomous",
			id: "autonomous_scoring",
			fields: {
				autonomous_speaker_notes: {
					title: "Speaker",
					type: "counter",
					description: "Notes scored in the speaker during autonomous.",
					color: MD2Colors.purple500,
					missed_key: "autonomous_speaker_missed",
					getScore: game => game.autonomous_speaker_notes * 5,
				},
				autonomous_amp_notes: {
					title: "Amp",
					type: "counter",
					description: "Notes scored in the amp during autonomous.",
					color: MD2Colors.green500,
					missed_key: "autonomous_amp_missed",
					getScore: game => game.autonomous_amp_notes * 2,
				},
				autonomous_mobility: {
					title: "Mobility",
					type: "bool",
					description: "Robot exits starting zone for 2 pts.",
					color: MD2Colors.blue500,
					getScore: game => game.autonomous_mobility ? 2 : 0,
				},
			},
		},
		{
			color: MD2Colors.white,
			title: "Teleop Note Scoring",
			icon: "music-note",
			phase: "teleop",
			id: "teleop_note_scoring",
			fields: {
				teleop_speaker_notes: {
					title: "Speaker",
					type: "counter",
					description: "Notes scored in the speaker during teleop.",
					color: MD2Colors.purple500,
					missed_key: "teleop_speaker_missed",
					getScore: game => game.teleop_speaker_notes * 2,
				},
				teleop_speaker_amplified_notes: {
					title: "Speaker (Amplified)",
					type: "counter",
					description: "Amplified speaker shots (after amp activation).",
					color: MD2Colors.orange500,
					missed_key: "teleop_speaker_amplified_missed",
					getScore: game => game.teleop_speaker_amplified_notes * 5,
				},
				teleop_amp_notes: {
					title: "Amp",
					type: "counter",
					description: "Notes scored in the amp during teleop.",
					color: MD2Colors.green500,
					missed_key: "teleop_amp_missed",
					getScore: game => game.teleop_amp_notes,
				},
			},
		},
		{
			color: MD2Colors.blue500,
			title: "Stage & Endgame",
			icon: "theater-comedy",
			phase: "teleop",
			id: "stage_endgame",
			fields: {
				stage_result: {
					title: "Stage Result",
					type: "enum",
					description: "Park, climb, or spotlight performance on the stage.",
					color: MD2Colors.blue500,
					values: StageResult,
					defaultValue: StageResult.NONE,
					getScore: (game) => {
						switch (game.stage_result as StageResult) {
							case StageResult.PARK: return 1;
							case StageResult.CLIMB: return 3;
							case StageResult.SPOTLIT: return 4;
							default: return 0;
						}
					}
				},
				stage_harmony: {
					title: "Harmony",
					type: "counter",
					description: "Robots harmonizing on the chain for 2 pts each.",
					color: MD2Colors.cyan500,
					getScore: (game) => game.stage_harmony * 2,
				},
				trap_notes: {
					title: "Trap",
					type: "counter",
					description: "Notes scored into the trap during endgame.",
					color: MD2Colors.red500,
					missed_key: "trap_missed",
					getScore: (game) => game.trap_notes * 5,
				},
			},
		},
	],
	fieldCalculations: {
		autonomousNoteScore: ["autonomous_speaker_notes", "autonomous_amp_notes"],
		autonomousMobilityScore: ["autonomous_mobility"],

		teleopSpeakerScore: [
			"teleop_speaker_notes",
			"teleop_speaker_amplified_notes",
		],
		teleopAmpScore: ["teleop_amp_notes"],

		stageScore: ["stage_result", "stage_harmony", "trap_notes"],
	},

	totalCalculations: {
		autonomousScore: ["autonomousNoteScore", "autonomousMobilityScore"],
		teleopScore: ["teleopSpeakerScore", "teleopAmpScore"],
		endgameScore: ["stageScore"],
		notesScore: ["autonomousNoteScore", "teleopSpeakerScore", "teleopAmpScore"],
	},

	totalScore: ["autonomousScore", "teleopScore", "endgameScore"],
	insights: [
		{
			check: game =>
				game.getAverageScore("autonomousScore") >
				game.getAverageScore("teleopScore") + 5,
			text: "Exceptionally strong autonomous performance",
			isPositive: true,
		},
		{
			check: game => game.getAverageScore("endgameScore") >= 10,
			text: "Reliable endgame climbs and traps",
			isPositive: true,
		},
		{
			check: game => game.getAverageScore("notesScore") >= 40,
			text: "High overall scoring throughput",
			isPositive: true,
		},
	],
	strengths: [
		{
			check: team => team.getAverageScore("autonomousScore") >= 15,
			text: "Strong autonomous scoring",
		},
		{
			check: team => team.getAverageScore("teleopScore") >= 35,
			text: "Excellent teleop note cycling",
		},
		{
			check: team => team.getAverageScore("endgameScore") >= 12,
			text: "Consistent and valuable endgame",
		},
		{
			check: team => team.bestScore >= 90,
			text: "Very high scoring ceiling",
		},
	],
	weaknesses: [
		{
			check: team => team.getAverageScore("autonomousScore") < 8,
			text: "Weak autonomous – low early advantage",
		},
		{
			check: team => team.getAverageScore("teleopScore") < 20,
			text: "Low teleop scoring and cycling",
		},
		{
			check: team => team.getAverageScore("endgameScore") < 5,
			text: "Inconsistent endgame (park/climb/spotlit)",
		},
	],
	recommendations: [
		{
			check: team => team.getAverageScore("autonomousScore") < 12,
			text: "Invest in reliable auto paths and tuning to increase early lead",
		},
		{
			check: team => team.getAverageScore("teleopScore") < 28,
			text: "Optimize teleop cycles and amp/speaker balance",
		},
		{
			check: team => team.getAverageScore("endgameScore") < 8,
			text: "Focus on consistent climbs and harmonies in endgame",
		},
	],
	breakdownGraph: [
		{
			label: "Auto",
			val: team => team.getAverageScore("autonomousScore"),
			color: MD2Colors.orange500,
		},
		{
			label: "Teleop",
			val: team => team.getAverageScore("teleopScore"),
			color: MD2Colors.green500,
		},
		{
			label: "Endgame",
			val: team => team.getAverageScore("endgameScore"),
			color: MD2Colors.blue500,
		},
	],
	gameCard: [
		{
			label: "Auto",
			val: game => game.autonomousScore,
			color: MD2Colors.orange500,
		},
		{
			label: "Teleop",
			val: game => game.teleopScore,
			color: MD2Colors.green500,
		},
		{
			label: "Endgame",
			val: game => game.endgameScore,
			color: MD2Colors.blue500,
		},
	],
	performance: [
		{
			label: "Autonomous Performance",
			val: team => team.getAverageScore("autonomousScore"),
			color: MD2Colors.orange500,
		},
		{
			label: "Teleop Performance",
			val: team => team.getAverageScore("teleopScore"),
			color: MD2Colors.green500,
		},
		{
			label: "Endgame Performance",
			val: team => team.getAverageScore("endgameScore"),
			color: MD2Colors.blue500,
		},
	],
	scoreSummary: [
		{
			label: () => "Total",
			val: game => game.totalScore,
			color: MD2Colors.amber500,
		},
		{
			label: () => "Teleop",
			val: game => game.teleopScore,
			color: MD2Colors.blue500,
		},
		{
			label: () => "Autonomous",
			val: game => game.autonomousScore,
			color: MD2Colors.green500,
		},
		{
			label: game => stageResultLabel(game).toUpperCase(),
			val: game => game.endgameScore,
			color: MD2Colors.orange500,
		},
	],
	gameDetailedBreakdowns: [
		{
			title: "Autonomous Breakdown",
			stats: [
				{
					label: "Speaker",
					val: game => game.getValue("autonomous_speaker_notes"),
					note: game => game.autonomous_speaker_notes + " pts",
					color: MD2Colors.purple500,
				},
				{
					label: "Amp",
					val: game => game.getValue("autonomous_amp_notes"),
					note: game => game.autonomous_amp_notes + " pts",
					color: MD2Colors.green500,
				},
				{
					label: "Mobility",
					val: game => game.getValue("autonomous_mobility"),
					note: game => game.autonomous_mobility ? "2 pts" : "0 pts",
					color: MD2Colors.blue500,
				},
			],
			extraStats: [
				{
					icon: "close",
					label: game =>
						`Missed: Speaker: ${game.getValue("autonomous_speaker_missed")}, Amp: ${game.getValue("autonomous_amp_missed")}`,
					color: MD2Colors.red500,
				},
			],
		},
		{
			title: "Teleop Note Breakdown",
			stats: [
				{
					label: "Speaker",
					val: game => game.getValue("teleop_speaker_notes"),
					note: game => game.teleop_speaker_notes * 2 + " pts",
					color: MD2Colors.purple500,
				},
				{
					label: "Speaker (Amplified)",
					val: game => game.getValue("teleop_speaker_amplified_notes"),
					note: game => game.teleop_speaker_amplified_notes * 5 + " pts",
					color: MD2Colors.orange500,
				},
				{
					label: "Amp",
					val: game => game.getValue("teleop_amp_notes"),
					note: game => game.teleop_amp_notes + " pts",
					color: MD2Colors.green500,
				},
				{
					label: "Trap",
					val: game => game.getValue("trap_notes"),
					note: game => game.trap_notes * 5 + " pts",
					color: MD2Colors.red500,
				},
			],
			extraStats: [
				{
					icon: "close",
					label: game =>
						`Missed: Speaker: ${game.getValue("teleop_speaker_missed")}, Amplified: ${game.getValue("teleop_speaker_amplified_missed")}, Amp: ${game.getValue("teleop_amp_missed")}, Trap: ${game.getValue("trap_missed")}`,
					color: MD2Colors.red500,
				},
			],
		},
		{
			title: "Endgame Performance",
			stats: [
				{
					label: "Stage Points",
					val: game => game.stageScore,
					note: game => `${stageResultLabel(game)} (+${game.stageScore} pts)`,
					color: MD2Colors.blue500,
				},
				{
					label: "Harmony",
					val: game => game.getValue("stage_harmony"),
					note: game => game.stage_harmony * 2 + " pts",
					color: MD2Colors.cyan500,
				},
				{
					label: "Trap Notes",
					val: game => game.getValue("trap_notes"),
					note: game => game.trap_notes * 5 + " pts",
					color: MD2Colors.red500,
				},
			],
			extraStats: [
				{
					icon: "emoji-events",
					label: game =>
						`Stage Result: ${stageResultLabel(game).toUpperCase()} (+${game.stageScore} pts)`,
					color: MD2Colors.amber500,
				},
			],
		},
	],
	teamDetailedBreakdowns: [
		{
			title: "Team Performance Summary",
			stats: [
				{
					label: "Games Played",
					val: team => team.games.length.toString(),
					color: MD2Colors.blue500,
					icon: "sports-esports",
				},
				{
					label: "Avg Total",
					val: team => team.averageTotalScore.toFixed(1),
					color: MD2Colors.amber500,
					icon: "trending-up",
				},
				{
					label: "Avg Teleop",
					val: team => team.getAverageScore("teleopScore").toFixed(1),
					color: MD2Colors.green500,
					icon: "sports",
				},
				{
					label: "Avg Auto",
					val: team => team.getAverageScore("autonomousScore").toFixed(1),
					color: MD2Colors.purple500,
					icon: "auto-awesome",
				},
				{
					label: "Avg Endgame",
					val: team => team.getAverageScore("endgameScore").toFixed(1),
					color: MD2Colors.orange500,
					icon: "theater-comedy",
				},
				{
					label: "Climb/Spotlit Games",
					val: team => {
						const stageGames = team.games.filter(g => {
							const res = stageResultLabel(g);
							return res === StageResult.CLIMB || res === StageResult.SPOTLIT;
						}).length;
						return `${stageGames}/${team.games.length}`;
					},
					color: MD2Colors.orange500,
					icon: "check-circle",
				},
			],
			extraStats: [],
			itemsPerRow: 2,
		},
		{
			title: "Note Scoring Averages",
			stats: [
				{
					label: "Auto Speaker",
					val: team =>
						team.getAverageValue("autonomous_speaker_notes").toFixed(1),
					color: MD2Colors.purple500,
				},
				{
					label: "Auto Amp",
					val: team =>
						team.getAverageValue("autonomous_amp_notes").toFixed(1),
					color: MD2Colors.green500,
				},
				{
					label: "Tele Speaker",
					val: team =>
						team.getAverageValue("teleop_speaker_notes").toFixed(1),
					color: MD2Colors.purple500,
				},
				{
					label: "Tele Speaker (Amplified)",
					val: team =>
						team.getAverageValue("teleop_speaker_amplified_notes").toFixed(1),
					color: MD2Colors.orange500,
				},
				{
					label: "Tele Amp",
					val: team =>
						team.getAverageValue("teleop_amp_notes").toFixed(1),
					color: MD2Colors.green500,
				},
				{
					label: "Trap",
					val: team => team.getAverageValue("trap_notes").toFixed(1),
					color: MD2Colors.red500,
				},
			],
			extraStats: [],
		},
		{
			title: "Endgame & Harmony Averages",
			stats: [
				{
					label: "Avg Endgame Score",
					val: team => team.getAverageScore("endgameScore").toFixed(1),
					color: MD2Colors.blue500,
				},
				{
					label: "Avg Harmony Count",
					val: team => team.getAverageValue("stage_harmony").toFixed(1),
					color: MD2Colors.cyan500,
				},
			],
			extraStats: [],
		},
	],
};

const stageResultLabel = (game: Game): StageResult =>
	(game.getValue("stage_result") as StageResult) || StageResult.NONE;
