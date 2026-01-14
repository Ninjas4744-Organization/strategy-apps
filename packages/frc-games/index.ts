import {Crescendo} from "./games/Crescendo";
import {Reefscape} from "./games/Reefscape";
import type {FRCGame} from "./types";

type Games = {
	[year: number]: FRCGame;
}

export const games: Games = {
	2024: Crescendo,
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

export * from './calculations';
