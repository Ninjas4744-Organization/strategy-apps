import {Crescendo} from "./games/Crescendo";
import {Reefscape} from "./games/Reefscape";
import type {FRCGame} from "./types";
import {REBUILT} from "./games/REBUILT.ts";

type Games = {
	[year: number]: FRCGame;
}

export const games: Games = {
	2024: Crescendo,
	2025: Reefscape,
	2026: REBUILT,
};

export const initGameData = (year: number) => {
	const game = games[year];
	if (!game) {
		return {};
	}

	let data: Record<string, any> = {};
	for (const section of Object.values(game.sections)) {
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

export const initPitData = (year: number) => {
	const game = games[year];
	if (!game || !game.pitScoutingAttributes) {
		return {};
	}

	let data: Record<string, any> = {};
	for (const attributeKey in game.pitScoutingAttributes) {
		const attribute = game.pitScoutingAttributes[attributeKey];
		const dataKey = attribute?.id ?? attributeKey;
		if (attribute?.type === 'enum') {
			data[dataKey] = attribute.defaultValue;
		} else {
			data[dataKey] = false;
		}
	}
	return data;
}

export * from './calculations';
