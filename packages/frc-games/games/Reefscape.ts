import type {Game} from "../Game.ts";
import {MD2Colors} from "react-native-paper";

enum CageLevel {
	NONE = 'none',
	PARK = 'park',
	SHALLOW = 'shallow',
	DEEP = 'deep',
}

export const Reefscape: Game = {
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
		parkingScore: ['cage_level'],
	},
	totalCalculations: {
		teleopScore: ['teleopCoralScore', 'teleopAlgaeScore'],
		autonomousScore: ['autonomousCoralScore', 'autonomousAlgaeScore'],
		parkingScore: ['parkingScore'],
		algaeScore: ['teleopAlgaeScore', 'autonomousAlgaeScore'],
	},
	insights: [],
	recommendations: [],
	strengths: [],
	weaknesses: [],
	breakdownGraph: [],
	gameCard: [],
	scoreSummary: [],
	breakdowns: [],
	performance: [],
};
