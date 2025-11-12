import type {FRCGame} from "../types";
import {MD2Colors} from "react-native-paper";
import {Game} from "../calculations";

enum CageLevel {
	NONE = 'none',
	PARK = 'park',
	SHALLOW = 'shallow',
	DEEP = 'deep',
}

export const Reefscape: FRCGame = {
	sections: [
		{
			color: MD2Colors.orange500,
			title: "Algae Collection",
			icon: "grass",
			phase: 'autonomous',
			id: 'auto_algae_collection',
			fields: {
				autonomous_algae_net: {
					title: 'Net',
					type: 'counter',
					color: MD2Colors.blue500,
					missed_key: 'autonomous_net_missed',
					getScore: game => game.autonomous_algae_net * 2,
				},
				autonomous_algae_processed: {
					title: 'Processor',
					type: 'counter',
					color: MD2Colors.green500,
					missed_key: 'autonomous_processed_missed',
					getScore: game => game.autonomous_algae_processed,
				},
			},
		},
		{
			color: MD2Colors.white,
			title: "Coral Scoring",
			icon: "sports-volleyball",
			phase: 'autonomous',
			id: 'auto_coral_scoring',
			fields: {
				autonomous_corals_scored_l4: {
					title: 'Level 4',
					type: 'counter',
					color: MD2Colors.purple500,
					missed_key: 'autonomous_corals_missed_l4',
					getScore: game => game.autonomous_corals_scored_l4 * 5
				},
				autonomous_corals_scored_l3: {
					title: 'Level 3',
					type: 'counter',
					color: MD2Colors.blue500,
					missed_key: 'autonomous_corals_missed_l3',
					getScore: game => game.autonomous_corals_scored_l3 * 3
				},
				autonomous_corals_scored_l2: {
					title: 'Level 2',
					type: 'counter',
					color: MD2Colors.green500,
					missed_key: 'autonomous_corals_missed_l2',
					getScore: game => game.autonomous_corals_scored_l2 * 2
				},
				autonomous_corals_scored_l1: {
					title: 'Level 1',
					type: 'counter',
					color: MD2Colors.orange500,
					missed_key: 'autonomous_corals_missed_l1',
					getScore: game => game.autonomous_corals_scored_l1
				}
			},
		},
		{
			color: MD2Colors.green500,
			title: "Algae Collection",
			icon: "grass",
			phase: 'teleop',
			id: 'tele_algae_collection',
			fields: {
				algae_net: {
					title: 'Net',
					type: 'counter',
					color: MD2Colors.blue500,
					missed_key: 'algae_net_missed',
					getScore: game => game.algae_net * 2
				},
				algae_processed: {
					title: 'Processor',
					type: 'counter',
					color: MD2Colors.green500,
					missed_key: 'algae_processed_missed',
					getScore: game => game.algae_processed
				},
			},
		},
		{
			color: MD2Colors.white,
			title: "Coral Scoring",
			icon: "sports-volleyball",
			phase: 'teleop',
			id: 'tele_coral_scoring',
			fields: {
				corals_scored_l4: {
					title: 'Level 4',
					type: 'counter',
					color: MD2Colors.purple500,
					missed_key: 'corals_missed_l4',
					getScore: game => game.corals_scored_l4 * 5
				},
				corals_scored_l3: {
					title: 'Level 3',
					type: 'counter',
					color: MD2Colors.blue500,
					missed_key: 'corals_missed_l3',
					getScore: game => game.corals_scored_l3 * 3
				},
				corals_scored_l2: {
					title: 'Level 2',
					type: 'counter',
					color: MD2Colors.green500,
					missed_key: 'corals_missed_l2',
					getScore: game => game.corals_scored_l2 * 2
				},
				corals_scored_l1: {
					title: 'Level 1',
					type: 'counter',
					color: MD2Colors.orange500,
					missed_key: 'corals_missed_l1',
					getScore: game => game.corals_scored_l1
				}
			},
		},
		{
			color: MD2Colors.blue500,
			title: "Cage Level",
			icon: "water-drop",
			phase: 'teleop',
			id: 'cage_level',
			fields: {
				cage_level: {
					title: 'Cage Level',
					type: 'enum',
					color: MD2Colors.blue500,
					values: CageLevel,
					defaultValue: CageLevel.NONE,
					getScore: (game) => {
						switch (game.cage_level as CageLevel) {
							case CageLevel.PARK:
								return 2;
							case CageLevel.SHALLOW:
								return 6;
							case CageLevel.DEEP:
								return 12;
							default:
								return 0;
						}
					}
				}
			},
		},
	],
	fieldCalculations: {
		teleopCoralScore: ['corals_scored_l1', 'corals_scored_l2', 'corals_scored_l3', 'corals_scored_l4'],
		autonomousCoralScore: ['autonomous_corals_scored_l1', 'autonomous_corals_scored_l2', 'autonomous_corals_scored_l3', 'autonomous_corals_scored_l4'],
		teleopAlgaeScore: ['algae_processed', 'algae_net'],
		autonomousAlgaeScore: ['autonomous_algae_processed', 'autonomous_algae_net'],
		cageLevel: ['cage_level'],
	},
	totalCalculations: {
		teleopScore: ['teleopCoralScore', 'teleopAlgaeScore'],
		autonomousScore: ['autonomousCoralScore', 'autonomousAlgaeScore'],
		parkingScore: ['cageLevel'],
		algaeScore: ['teleopAlgaeScore', 'autonomousAlgaeScore'],
	},
	totalScore: ['teleopScore', 'autonomousScore', 'parkingScore'],
	insights: [
		{
			check: game => game.getAverageScore('autonomousScore') > game.getAverageScore('teleopScore') + 10,
			text: 'Strong autonomous performance',
			isPositive: true,
		},
		{
			check: game => game.getAverageScore('algaeScore') > 15,
			text: 'Excellent algae handling capabilities',
			isPositive: true,
		},
	],
	strengths: [
		{
			check: team => team.getAverageScore('autonomousScore') > 20,
			text: 'Strong autonomous performance',
		},
		{
			check: team => team.getAverageScore('teleopScore') > 30,
			text: 'Excellent teleop scoring',
		},
		{
			check: team => team.getAverageScore('algaeScore') > 15,
			text: 'Great algae handling',
		},
		{
			check: team => team.bestScore > 80,
			text: 'High scoring potential',
		},
	],
	weaknesses: [
		{
			check: team => team.getAverageScore('autonomousScore') < 10,
			text: 'Weak autonomous performance',
		},
		{
			check: team => team.getAverageScore('teleopScore') < 20,
			text: 'Low teleop scoring',
		},
		{
			check: team => team.getAverageScore('algaeScore') < 8,
			text: 'Poor algae handling',
		},
	],
	recommendations: [
		{
			check: team => team.getAverageScore('autonomousScore') < 15,
			text: 'Focus on improving autonomous programming and strategy',
		},
		{
			check: team => team.getAverageScore('teleopScore') < 25,
			text: 'Work on teleop efficiency and driver coordination',
		},
		{
			check: team => team.getAverageScore('algaeScore') < 10,
			text: 'Improve algae collection and processing mechanisms',
		},
	],
	breakdownGraph: [
		{
			label: 'Auto',
			val: team => team.getAverageScore('autonomousScore'),
			color: MD2Colors.orange500,
		},
		{
			label: 'Teleop',
			val: team => team.getAverageScore('teleopScore'),
			color: MD2Colors.green500,
		},
		{
			label: 'Algae',
			val: team => team.getAverageScore('algaeScore'),
			color: MD2Colors.blue500,
		}
	],
	gameCard: [
		{
			label: 'Auto',
			val: game => game.autonomousScore,
			color: MD2Colors.orange500,
		},
		{
			label: 'Teleop',
			val: game => game.teleopScore,
			color: MD2Colors.green500,
		},
		{
			label: 'Cage Level',
			val: game => game.cageLevel,
			color: MD2Colors.blue500,
		},
	],
	performance: [
		{
			label: 'Autonomous Performance',
			val: team => team.getAverageScore('autonomousScore'),
			color: MD2Colors.orange500,
		},
		{
			label: 'Teleop Performance',
			val: team => team.getAverageScore('teleopScore'),
			color: MD2Colors.green500,
		},
		{
			label: 'Algae Handling',
			val: team => team.getAverageScore('algaeScore'),
			color: MD2Colors.blue500,
		},
	],
	scoreSummary: [
		{
			label: () => 'Total',
			val: game => game.totalScore,
			color: MD2Colors.amber500,
		},
		{
			label: () => 'Teleop',
			val: game => game.teleopScore,
			color: MD2Colors.blue500,
		},
		{
			label: () => 'Autonomous',
			val: game => game.autonomousScore,
			color: MD2Colors.green500,
		},
		{
			label: game => cageLevel(game).toUpperCase(),
			val: game => game.parkingScore,
			color: MD2Colors.orange500,
		},
	],
	gameDetailedBreakdowns: [
		{
			title: 'Coral Scoring Breakdown',
			stats: [
				{
					label: 'L1',
					val: game => game.getValue('corals_scored_l1'),
					note: game => game.corals_scored_l1 + ' pts',
					color: MD2Colors.red500,
				},
				{
					label: 'L2',
					val: game => game.getValue('corals_scored_l2'),
					note: game => game.corals_scored_l2 + ' pts',
					color: MD2Colors.orange500,
				},
				{
					label: 'L3',
					val: game => game.getValue('corals_scored_l3'),
					note: game => game.corals_scored_l3 + ' pts',
					color: MD2Colors.yellow500,
				},
				{
					label: 'L4',
					val: game => game.getValue('corals_scored_l4'),
					note: game => game.corals_scored_l4 + ' pts',
					color: MD2Colors.green500,
				},
			],
			extraStats: [
				{
					icon: 'close',
					label: game => `Missed: ${game.getValue('corals_missed')}`,
					color: MD2Colors.red500,
				},
			]
		},
		{
			title: 'Algae Scoring Breakdown',
			stats: [
				{
					label: 'Processed',
					val: game => game.getValue('algae_processed'),
					note: game => game.algae_processed + ' pts',
					color: MD2Colors.blue500,
				},
				{
					label: 'Net',
					val: game => game.getValue('algae_net'),
					note: game => game.algae_net + ' pts',
					color: MD2Colors.cyan500,
				},
			],
			extraStats: [
				{
					icon: 'close',
					label: game => `Missed: Processed: ${game.getValue('algae_processed_missed')}, Net: ${game.getValue('algae_net_missed')}`,
					color: MD2Colors.red500,
				},
			]
		},
		{
			title: 'Autonomous Performance',
			stats: [
				{
					label: 'Corals',
					val: game => game.autonomousCoralScore,
					note: () => '',
					color: MD2Colors.purple500,
				},
				{
					label: 'Algae',
					val: game => game.autonomousAlgaeScore,
					note: () => '',
					color: MD2Colors.teal500,
				},
			],
			extraStats: [
				{
					icon: 'auto-awesome',
					label: game => `Autonomous Corals: L1: ${game.getValue('autonomous_corals_scored_l1')}, L2: ${game.getValue('autonomous_corals_scored_l2')}, L3: ${game.getValue('autonomous_corals_scored_l3')}, L4: ${game.getValue('autonomous_corals_scored_l4')}`,
					color: MD2Colors.purple500,
				},
				{
					icon: 'water-drop',
					label: game => `Autonomous Algae: Processed: ${game.getValue('autonomous_algae_processed')} (Missed: ${game.getValue('autonomous_algae_processed_missed')}), Net: ${game.getValue('autonomous_algae_net')} (Missed: ${game.getValue('autonomous_algae_net_missed')})`,
					color: MD2Colors.teal500,
				},
				{
					icon: 'local-parking',
					label: game => `Cage Level: ${cageLevel(game).toUpperCase() ?? 'N/A'} (+${game.parkingScore} points)`,
					color: MD2Colors.amber500,
				},
			]
		},
	],
	teamDetailedBreakdowns: [
		{
			title: 'Team Performance Summary',
			stats: [
				{
					label: 'Games Played',
					val: team => team.games.length.toString(),
					color: MD2Colors.blue500,
					icon: 'sports-esports'
				},
				{
					label: 'Avg Total',
					val: team => team.averageTotalScore.toFixed(1),
					color: MD2Colors.amber500,
					icon: 'trending-up',
				},
				{
					label: 'Avg Teleop',
					val: team => team.getAverageScore('teleopScore').toFixed(1),
					color: MD2Colors.green500,
					icon: 'sports',
				},
				{
					label: 'Avg Auto',
					val: team => team.getAverageScore('autonomousScore').toFixed(1),
					color: MD2Colors.purple500,
					icon: 'auto-awesome',
				},
				{
					label: 'Avg Cage Score',
					val: team => team.getAverageScore('parkingScore').toFixed(1),
					color: MD2Colors.amber500,
					icon: 'local-parking',
				},
				{
					label: 'Cage Games',
					val: team => {
						const cageGames = team.games.filter(game => game.cageLevel !== CageLevel.NONE).length;
						return `${cageGames}/${team.games.length}`;
					},
					color: MD2Colors.orange500,
					icon: 'check-circle',
				},
			],
			extraStats: [],
			itemsPerRow: 2,
		},
		{
			title: 'Coral Scoring Averages',
			stats: [
				{
					label: 'L1',
					val: team => team.getAverageValue('corals_scored_l1').toFixed(1),
					color: MD2Colors.red500
				},
				{
					label: 'L2',
					val: team => team.getAverageValue('corals_scored_l2').toFixed(1),
					color: MD2Colors.orange500
				},
				{
					label: 'L3',
					val: team => team.getAverageValue('corals_scored_l3').toFixed(1),
					color: MD2Colors.yellow500
				},
				{
					label: 'L4',
					val: team => team.getAverageValue('corals_scored_l4').toFixed(1),
					color: MD2Colors.green500
				}
			],
			extraStats: [],
		},
		{
			title: 'Algae Scoring Averages',
			stats: [
				{
					label: 'Processed',
					val: team => team.getAverageValue('algae_processed').toFixed(1),
					color: MD2Colors.blue500
				},
				{
					label: 'Net',
					val: team => team.getAverageValue('algae_net').toFixed(1),
					color: MD2Colors.cyan500
				},
			],
			extraStats: [],
		},
	],
};

const cageLevel = (game: Game) => game.getValue('cage_level') || CageLevel.NONE;
