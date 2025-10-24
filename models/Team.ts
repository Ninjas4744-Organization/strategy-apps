import { Game } from './Game';
import { Model } from '../interfaces/Model';

export class Team implements Model {
	constructor(
		public id: string,
		public teamNumber: number,
		public games: Game[] = [],
	) {}

	static fromMap(id: string, data: Record<string, any>): Team {
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

		return new Team(id, teamNumber, []);
	}

	toMap(): Record<string, any> {
		return {
			team_number: this.teamNumber,
		};
	}

	// Calculate team statistics
	get averageAutonomousScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.autonomousScore, 0);
		return total / this.games.length;
	}

	get averageTeleopScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.teleopScore, 0);
		return total / this.games.length;
	}

	get averageAlgaeScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.algaeScore, 0);
		return total / this.games.length;
	}

	get averageTotalScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.totalScore, 0);
		return total / this.games.length;
	}

	get consistencyScore(): number {
		if (this.games.length < 2) return 0;
		const scores = this.games.map((g) => g.totalScore);
		const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
		const variance =
			scores
				.map((s) => (s - mean) * (s - mean))
				.reduce((a, b) => a + b, 0) / scores.length;
		return 1 / (1 + variance); // Higher consistency = higher score
	}

	get scoreTrend(): number[] {
		return this.games.map((g) => g.totalScore);
	}
}
