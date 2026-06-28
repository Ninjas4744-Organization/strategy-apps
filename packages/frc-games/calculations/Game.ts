import type {FRCGame} from "../types";

export class Game {
	[key: string]: any;

	constructor(public game: FRCGame, public data: Record<string, any>) {
		for (const section of Object.values(game.sections)) {
			for (const id in section.fields) {
				Object.defineProperty(this, id, {
					get(): number {
						return section.fields[id]?.getScore(data) ?? 0;
					},
					configurable: true
				});
			}
		}
		for (const calculation in game.fieldCalculations) {
			Object.defineProperty(this, calculation, {
				get(): number {
					return game.fieldCalculations[calculation]?.reduce(
						(sum, cur) => sum + (this[cur] ?? 0), 0
					) || 0;
				},
				configurable: true
			});
		}
		for (const calculation in game.totalCalculations) {
			Object.defineProperty(this, calculation, {
				get(): number {
					return game.totalCalculations[calculation]?.reduce(
						(sum, cur) => sum + (this[cur] ?? 0), 0
					) || 0;
				},
				configurable: true
			});
		}
	}

	get totalScore(): number {
		return this.game.totalScore.reduce(
			(sum, cur) => sum + (this[cur] ?? 0), 0
		) || 0;
	}

	getValue(field: string) {
		return this.data[field] || 0;
	}
}
