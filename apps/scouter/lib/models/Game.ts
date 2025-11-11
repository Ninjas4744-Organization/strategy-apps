import {Timestamp} from 'firebase/firestore';
import {Model} from "@/lib/interfaces/Model";
import {Game as GameCalculations} from "@ninjas-strategy/frc-games";
import {FRCGame} from "@ninjas-strategy/frc-games/types";

export class Game extends GameCalculations implements Model {
	constructor(
		public id: string,
		public game: FRCGame,
		public teamNumber: number,
		public gameNumber: string,
		public timestamp: Date,
		public data: Record<string, any>,
	) {
		super(game, data);
	}

	static fromMap(id: string, game: FRCGame, data: Record<string, any>): Game {
		// Handle team_number as either string or int
		let teamNumber = 0;
		const teamNumberData = data['team_number'];
		if (teamNumberData !== null && teamNumberData !== undefined) {
			if (typeof teamNumberData === 'number') {
				teamNumber = teamNumberData;
			} else if (typeof teamNumberData === 'string') {
				teamNumber = parseInt(teamNumberData) || 0;
			}
		}

		return new Game(
			id,
			game,
			teamNumber,
			data['game_number'] ?? '',
			(data['timestamp'] instanceof Timestamp ? data['timestamp'].toDate() : new Date()) ?? new Date(),
			data,
		);
	}

	toMap(): Record<string, any> {
		return {
			team_number: this.teamNumber,
			game_number: this.gameNumber,
			timestamp: this.timestamp,
			...this.data,
		};
	}
}
