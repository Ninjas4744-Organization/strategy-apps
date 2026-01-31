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
		teleop_fuel_passing_inactive: {
			color: MD2Colors.green500,
			title: "Fuel Passing",
			icon: 'swap-horiz',
			id: 'teleop_fuel_passing_inactive',
			fields: {
				teleop_fuel_passed_inactive: {
					type: 'counter',
					title: 'Fuel Passed',
					color: MD2Colors.green500,
					getScore: () => 0,
				},
			},
		},
		endgame_fuel_scoring: {
			color: MD2Colors.white,
			title: "Fuel Scoring",
			icon: 'sports-handball',
			id: 'endgame_fuel_scoring',
			fields: {
				endgame_fuel_scored: {
					type: 'counter',
					title: 'Fuel Scored',
					color: MD2Colors.blue500,
					missed_key: 'endgame_fuel_missed',
					getScore: (game) => game['endgame_fuel_scored'] ?? 0,
				}
			},
		},
		endgame_fuel_passing: {
			color: MD2Colors.green500,
			title: "Fuel Passing",
			icon: 'swap-horiz',
			id: 'endgame_fuel_passing',
			fields: {
				endgame_fuel_passed: {
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
			sections: (game) => game.won_auto ? ['teleop_fuel_passing_inactive'] : ['teleop_fuel_scoring', 'teleop_fuel_passing'],
		},
		{
			title: 'Shift 2',
			description: 'Your hub is active if you won autonomous',
			icon: '2k',
			phase: 'teleop',
			sections: (game) => game.won_auto ? ['teleop_fuel_scoring', 'teleop_fuel_passing'] : ['teleop_fuel_passing_inactive'],
		},
		{
			title: 'Shift 3',
			description: 'Your hub is active if you lost autonomous',
			icon: '3k',
			phase: 'teleop',
			sections: (game) => game.won_auto ? ['teleop_fuel_passing_inactive'] : ['teleop_fuel_scoring', 'teleop_fuel_passing'],
		},
		{
			title: 'Shift 4',
			description: 'Your hub is active if you won autonomous',
			icon: '4k',
			phase: 'teleop',
			sections: (game) => game.won_auto ? ['teleop_fuel_scoring', 'teleop_fuel_passing'] : ['teleop_fuel_passing_inactive'],
		},
		{
			title: 'Endgame',
			description: 'Climb to the top',
			icon: 'sports-motorsports',
			phase: 'teleop',
			sections: () => ['endgame_fuel_scoring', 'endgame_fuel_passing', 'traversal'],
		}
	],
	fieldCalculations: {
		fuelScore: ['autonomous_fuel_scored', 'teleop_fuel_scored', 'endgame_fuel_scored'],
		traversalScore: ['autonomous_climb', 'traversal'],
	},
	amountCalculations: {
		fuelPassed: ['autonomous_fuel_passed', 'teleop_fuel_passed', 'endgame_fuel_passed'],
		fuelScored: ['autonomous_fuel_scored', 'teleop_fuel_scored', 'endgame_fuel_scored'],
		autonomousWon: ['won_auto'],
	},
	totalCalculations: {
		autonomousScore: ['autonomous_fuel_scored', 'autonomous_climb'],
		teleopScore: ['teleop_fuel_scored'],
		endgameScore: ['endgame_fuel_scored', 'traversal'],
	},
	totalScore: ['autonomousScore', 'teleopScore', 'endgameScore'],
	mainPageSections: [
		{
			title: 'Autonomous',
			description: '',
			cards: [
				{
					label: 'Avg Auto Score',
					icon: 'sports-esports',
					color: MD2Colors.orange500,
					val: (team) => team.getAverageScore('autonomousScore').toFixed(1),
					numericVal: (team) => team.getAverageScore('autonomousScore'),
				},
				{
					label: 'Climbs In Auto',
					icon: 'directions-run',
					color: MD2Colors.purple500,
					val: (team) => team.games.reduce((sum, game) => sum + (game['autonomous_climb'] ? 1 : 0), 0) + '/' + team.games.length,
					numericVal: (team) => team.games.reduce((sum, game) => sum + (game['autonomous_climb'] ? 1 : 0), 0),
				},
				{
					label: 'Fuel Scored (Auto)',
					icon: 'sports-handball',
					color: MD2Colors.blue500,
					val: (team) => team.getAverageScore('autonomous_fuel_scored').toFixed(1),
					numericVal: (team) => team.getAverageScore('autonomous_fuel_scored'),
				}
			],
		},
		{
			title: 'Teleop - Fuel',
			description: '',
			cards: [
				{
					label: 'Avg Teleop Score',
					icon: 'sports-esports',
					color: MD2Colors.green500,
					val: (team) => team.getAverageScore('teleopScore').toFixed(1),
					numericVal: team => team.getAverageScore('teleopScore'),
				}
			],
		},
		{
			title: 'Teleop - Passing',
			description: '',
			cards: [
				{
					label: 'Fuel Passed - Inactive',
					icon: 'swap-horiz',
					color: MD2Colors.green500,
					val: (team) => team.getAverageValue('teleop_fuel_passed_inactive').toFixed(1),
					numericVal: team => team.getAverageValue('teleop_fuel_passed_inactive'),
				},
				{
					label: 'Fuel Passed - Active',
					icon: 'swap-horiz',
					color: MD2Colors.green500,
					val: (team) => team.getAverageValue('teleop_fuel_passed').toFixed(1),
					numericVal: team => team.getAverageValue('teleop_fuel_passed'),
				},
			],
		},
		{
			title: 'Endgame',
			description: '',
			cards: [
				{
					label: 'Avg Endgame Score',
					icon: 'sports-motorsports',
					color: MD2Colors.blue500,
					val: (team) => team.getAverageScore('endgameScore').toFixed(1),
					numericVal: team => team.getAverageScore('endgameScore'),
				},
				{
					label: 'Average Traversal Level',
					icon: 'directions-run',
					color: MD2Colors.blue500,
					val: (team) => {
						const totalLevels = team.games.reduce((sum, game) => {
							switch (game['traversal_level']) {
								case TraversalLevel.L1:
									return sum + 1;
								case TraversalLevel.L2:
									return sum + 2;
								case TraversalLevel.L3:
									return sum + 3;
								default:
									return sum;
							}
						}, 0);
						return (totalLevels / team.games.length).toFixed(1);
					},
					numericVal: team => {
						const totalLevels = team.games.reduce((sum, game) => {
							switch (game['traversal_level']) {
								case TraversalLevel.L1:
									return sum + 1;
								case TraversalLevel.L2:
									return sum + 2;
								case TraversalLevel.L3:
									return sum + 3;
								default:
									return sum;
							}
						}, 0);
						return totalLevels / team.games.length;
					}
				}
			],
		},
	],
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
