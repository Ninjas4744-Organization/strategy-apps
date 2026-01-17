import type {FRCGame} from "../types.ts";
import {MD2Colors} from "react-native-paper";

enum TraversalLevel {
	NONE = 'None',
	L1 = 'Level 1',
	L2 = 'Level 2',
	L3 = 'Level 3',
}

export const REBUILT: FRCGame = {
	sections: {
		auto_fuel: {
			color: MD2Colors.orange500,
			title: "Autonomous Fuel",
			icon: 'auto-awesome',
			id: 'auto_fuel',
			fields: {
				autonomous_fuel_scored: {
					type: 'counter',
					title: 'Fuel Scored',
					color: MD2Colors.blue500,
					missed_key: 'autonomous_fuel_missed',
					getScore: (game) => game['autonomous_fuel_scored'] ?? 0,
				},
				autonomous_fuel_passed: {
					type: 'counter',
					title: 'Fuel Passed',
					color: MD2Colors.green500,
					getScore: () => 0,
				}
			}
		},
		auto_traversal: {
			color: MD2Colors.purple500,
			title: "Autonomous Traversal",
			icon: 'directions-run',
			id: 'auto_traversal',
			fields: {
				autonomous_climb: {
					type: 'bool',
					title: 'Autonomous Climb',
					color: MD2Colors.purple500,
					getScore: (game) => game['autonomous_climb'] ? 15 : 0,
				},
				won_auto: {
					type: 'bool',
					title: 'Won Autonomous',
					color: MD2Colors.amber500,
					getScore: () => 0,
				}
			}
		},
		teleop_fuel_scoring: {
			color: MD2Colors.white,
			title: "Fuel Scoring",
			icon: 'sports-handball',
			id: 'teleop_fuel_scoring',
			fields: {
				teleop_fuel_scored: {
					type: 'counter',
					title: 'Fuel Scored',
					color: MD2Colors.blue500,
					missed_key: 'teleop_fuel_missed',
					getScore: (game) => game['teleop_fuel_scored'] ?? 0,
				}
			},
		},
		teleop_fuel_passing: {
			color: MD2Colors.green500,
			title: "Fuel Passing",
			icon: 'swap-horiz',
			id: 'teleop_fuel_passing',
			fields: {
				teleop_fuel_passed: {
					type: 'counter',
					title: 'Fuel Passed',
					color: MD2Colors.green500,
					getScore: () => 0,
				},
			},
		},
		traversal: {
			color: MD2Colors.blue500,
			title: "Traversal Level",
			icon: "directions-run",
			id: 'traversal',
			fields: {
				traversal_level: {
					title: 'Traversal Level',
					type: 'enum',
					color: MD2Colors.blue500,
					values: TraversalLevel,
					defaultValue: TraversalLevel.NONE,
					getScore: (game) => {
						switch (game.cage_level as TraversalLevel) {
							case TraversalLevel.L1:
								return 10;
							case TraversalLevel.L2:
								return 20;
							case TraversalLevel.L3:
								return 30;
							default:
								return 0;
						}
					}
				}
			},
		}
	},
	pages: [
		{
			title: "Autonomous",
			description: 'Full auto control',
			icon: 'sports-esports',
			phase: 'autonomous',
			sections: () => ['auto_fuel', 'auto_traversal']
		},
		{
			title: 'Tranision shift',
			description: 'Both hubs are active',
			icon: 'sync-alt',
			phase: 'teleop',
			sections: () => ['teleop_fuel_scoring', 'teleop_fuel_passing'],
		},
		{
			title: 'Shift 1',
			description: 'Your hub is active if you lost autonomous',
			icon: '1k',
			phase: 'teleop',
			sections: () => ['teleop_fuel_passing'],
		},
		{
			title: 'Shift 2',
			description: 'Your hub is active if you won autonomous',
			icon: '2k',
			phase: 'teleop',
			sections: () => ['teleop_fuel_scoring', 'teleop_fuel_passing'],
		},
		{
			title: 'Shift 3',
			description: 'Your hub is active if you lost autonomous',
			icon: '3k',
			phase: 'teleop',
			sections: () => ['teleop_fuel_passing'],
		},
		{
			title: 'Shift 4',
			description: 'Your hub is active if you won autonomous',
			icon: '4k',
			phase: 'teleop',
			sections: () => ['teleop_fuel_scoring', 'teleop_fuel_passing'],
		},
		{
			title: 'Endgame',
			description: 'Climb to the top',
			icon: 'sports-motorsports',
			phase: 'teleop',
			sections: () => ['teleop_fuel_scoring', 'teleop_fuel_passing', 'traversal'],
		}
	],
	fieldCalculations: {
		fuelScore: ['autonomous_fuel_scored', 'teleop_fuel_scored'],
		traversalScore: ['autonomous_climb', 'traversal'],
	},
	amountCalculations: {
		fuelPassed: ['autonomous_fuel_passed', 'teleop_fuel_passed'],
		autonomousWon: ['won_auto'],
	},
	totalCalculations: {
		autonomousScore: ['autonomous_fuel_scored', 'autonomous_climb'],
		teleopScore: ['teleop_fuel_scored', 'traversal'],
	},
	totalScore: ['autonomousScore', 'teleopScore'],
	insights: [],
	recommendations: [],
	strengths: [],
	weaknesses: [],
	breakdownGraph: [],
	gameCard: [],
	performance: [],
	scoreSummary: [],
	gameDetailedBreakdowns: [],
	teamDetailedBreakdowns: [],
};
