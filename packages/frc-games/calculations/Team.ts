import type {Game} from "./Game";
import type {DisplayInsight, FRCGame} from "../types";

export class Team {
	games: Game[] = [];

	constructor(
		public game: FRCGame,
	) {}

	get averageTotalScore(): number {
		if (this.games.length === 0) {
			return 0;
		}
		const total = this.games.reduce((sum, game) => sum + game.totalScore, 0);
		return total / this.games.length;
	}

	get consistencyScore(): number {
		if (this.games.length < 2) {
			return 0;
		}
		const scores = this.games.map((g) => g.totalScore);
		const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
		const variance =
			scores
				.map((s) => (s - mean) * (s - mean))
				.reduce((a, b) => a + b, 0) / scores.length;
		return 1 / (1 + variance); // Higher consistency = higher score
	}

	get bestScore(): number {
		if (this.games.length === 0) {
			return 0;
		}
		return this.games.map(game => game.totalScore).reduce((a, b) => a > b ? a : b);
	}

	getAverageScore(key: string) {
		if (this.games.length === 0) {
			return 0;
		}
		const total = this.games.reduce((sum, game) => sum + game[key], 0);
		return total / this.games.length;
	}

	get streakInfo(): DisplayInsight {
		if (this.games.length === 0) {
			return {
				message: 'No games played yet',
				description: 'Need game data for streak analysis',
				isPositive: true,
			};
		}

		if (this.games.length === 1) {
			return {
				message: 'Only 1 game played',
				description: 'Need more data for streak analysis',
				isPositive: true,
			};
		}

		let currentStreak = 1;
		const isImproving = this.games[this.games.length - 1]!.totalScore > this.games[this.games.length - 2]!.totalScore;

		for (let i = this.games.length - 2; i >= 0; i--) {
			if (i + 1 < this.games.length) {
				if (isImproving && this.games[i + 1]!.totalScore > this.games[i]!.totalScore) {
					currentStreak++;
				} else if (
					!isImproving &&
					this.games[i + 1]!.totalScore < this.games[i]!.totalScore
				) {
					currentStreak++;
				} else {
					break;
				}
			}
		}

		if (isImproving && currentStreak >= 3) {
			return {
				message: `${currentStreak}-game improvement streak!`,
				description: 'Team is consistently getting better',
				isPositive: true,
			};
		} else if (!isImproving && currentStreak >= 3) {
			return {
				message: `${currentStreak}-game decline streak`,
				description: 'Team performance is decreasing',
				isPositive: false,
			};
		} else if (isImproving) {
			return {
				message: `${currentStreak}-game improvement streak`,
				description: 'Team is trending upward',
				isPositive: true,
			};
		} else {
			return {
				message: `${currentStreak}-game decline streak`,
				description: 'Team needs to reverse the trend',
				isPositive: false,
			};
		}
	}

	get insights(): DisplayInsight[] {
		if (this.games.length === 0)
			return [];

		const insights: DisplayInsight[] = [];

		// Win streak analysis
		insights.push(this.streakInfo);

		// Improvement trend
		if (this.games.length >= 6) {
			const recentGames = this.games.slice(0, 3);
			const earlierGames = this.games.slice(this.games.length - 3);

			if (recentGames.length === 3 && earlierGames.length === 3) {
				const recentAvg = recentGames.reduce((sum, game) => sum + game.totalScore, 0) / 3;
				const earlierAvg = earlierGames.reduce((sum, game) => sum + game.totalScore, 0) / 3;

				if (recentAvg > earlierAvg + 5) {
					insights.push({
						message: 'Team is showing significant improvement',
						isPositive: true,
					});
				} else if (recentAvg < earlierAvg - 5) {
					insights.push({
						message: 'Team performance has declined recently',
						isPositive: false,
					});
				}
			}
		}

		// Consistency analysis
		if (this.consistencyScore > 0.7) {
			insights.push({
				message: 'Very consistent performance across games',
				isPositive: true,
			});
		} else if (this.consistencyScore < 0.3) {
			insights.push({
				message: 'Inconsistent performance - high variance in scores',
				isPositive: false,
			});
		}

		// Strength identification
		if (this.getAverageScore('autonomousScore') > this.getAverageScore('teleopScore') + 10) {
			insights.push({
				message: 'Strong autonomous performance',
				isPositive: true,
			});
		}

		if (this.getAverageScore('algaeScore') > 15) {
			insights.push({
				message: 'Excellent algae handling capabilities',
				isPositive: true,
			});
		}

		return insights;
	}

	get strengths(): string[] {
		const strengths: string[] = [];

		for (let strength of this.game.strengths) {
			if (strength.check(this)) {
				strengths.push(strength.text);
			}
		}
		if (this.consistencyScore > 0.6) {
			strengths.push('Consistent performance');
		}

		return strengths.length === 0 ? ['Developing team - potential for growth'] : strengths;
	}

	get weaknesses(): string[] {
		const weaknesses: string[] = [];

		for (let weakness of this.game.weaknesses) {
			if (weakness.check(this)) {
				weaknesses.push(weakness.text);
			}
		}
		if (this.consistencyScore < 0.4) {
			weaknesses.push('Inconsistent performance');
		}

		return weaknesses.length === 0 ? ['Well-rounded team'] : weaknesses;
	}

	get recommendations(): string[] {
		const recommendations: string[] = [];

		for (let recommendation of this.game.recommendations) {
			if (recommendation.check(this)) {
				recommendations.push(recommendation.text);
			}
		}
		if (this.consistencyScore < 0.5) {
			recommendations.push('Practice consistency - focus on reliable performance');
		}
		if (this.games.length < 5) {
			recommendations.push('Need more game data for accurate analysis');
		}

		return recommendations.length === 0 ? ['Continue current strategies - team is performing well'] : recommendations;
	}
}
