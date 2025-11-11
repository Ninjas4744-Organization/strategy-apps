import {Reefscape} from "./games/Reefscape";
import type {Game} from "./Game";

type Games = {
	[year: number]: Game;
}

export const games: Games = {
	2025: Reefscape,
};

export const initGameData = (year: number) => {
	const game = games[year];
	if (!game) {
		return {};
	}

	let data: Record<string, any> = {};
	for (const section of game.sections) {
		for (const fieldKey in section.fields) {
			const field = section.fields[fieldKey];
			if (field?.type === 'counter') {
				data[fieldKey] = 0;
				data[field.missed_key!] = 0;
			} else if (field?.type === 'enum') {
				data[fieldKey] = field.defaultValue;
			} else {
				data[fieldKey] = false;
			}
		}
	}
	return data;
};

export const getPointsAndCalculations = (year: number, data: Record<string, any>): Record<string, number> => {
	const game = games[year];
	if (!game) {
		return {};
	}

	let points: Record<string, number> = {};
	for (const section of game.sections) {
		for (const fieldKey in section.fields) {
			points[fieldKey] = section.fields[fieldKey]?.getScore(data) ?? 0;
		}
	}
	for (const calculation in game.fieldCalculations) {
		points[calculation] = game.fieldCalculations[calculation]?.reduce((sum, cur) => sum + (points[cur] ?? 0), 0) ?? 0;
	}
	for (const calculation in game.totalCalculations) {
		points[calculation] = game.totalCalculations[calculation]?.reduce((sum, cur) => sum + (points[cur] ?? 0), 0) ?? 0;
	}
	return points;
};
