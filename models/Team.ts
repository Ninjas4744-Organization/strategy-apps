import {Game} from './Game';
import {Model} from '@/interfaces/Model';
import {Insight} from "@/interfaces/Insight";
import {StreakInfo} from "@/interfaces/StreakInfo";
import {CageLevel} from "@/interfaces/CageLevel";

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

	get averageCageScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.parkingScore, 0);
		return total / this.games.length;
	}

	get averageTotalScore(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.totalScore, 0);
		return total / this.games.length;
	}

	get averageL1(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.coralsScoredL1, 0);
		return total / this.games.length;
	}

	get averageL2(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.coralsScoredL2, 0);
		return total / this.games.length;
	}

	get averageL3(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.coralsScoredL3, 0);
		return total / this.games.length;
	}

	get averageL4(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.coralsScoredL4, 0);
		return total / this.games.length;
	}

	get averageAlgaeNet(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.algaeNet, 0);
		return total / this.games.length;
	}

	get averageAlgaeProcessed(): number {
		if (this.games.length === 0) return 0;
		const total = this.games.reduce((sum, game) => sum + game.algaeProcessed, 0);
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

	get cageGames(): number {
		if (this.games.length === 0) return 0;
		return this.games.filter(game => game.cageLevel !== CageLevel.NONE).length;
	}

	get bestScore(): number {
		if (this.games.length === 0)
			return 0;

		return this.games.map(game => game.totalScore).reduce((a, b) => a > b ? a : b);
	}

	get streakInfo(): StreakInfo {
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
		const isImproving =
			this.games[this.games.length - 1].totalScore >
			this.games[this.games.length - 2].totalScore;

		for (let i = this.games.length - 2; i >= 0; i--) {
			if (i + 1 < this.games.length) {
				if (
					isImproving &&
					this.games[i + 1].totalScore > this.games[i].totalScore
				) {
					currentStreak++;
				} else if (
					!isImproving &&
					this.games[i + 1].totalScore < this.games[i].totalScore
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

	get insights(): Insight[] {
		if (this.games.length === 0)
			return [];

		const insights: Insight[] = [];

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
		if (this.averageAutonomousScore > this.averageTeleopScore + 10) {
			insights.push({
				message: 'Strong autonomous performance',
				isPositive: true,
			});
		}

		if (this.averageAlgaeScore > 15) {
			insights.push({
				message: 'Excellent algae handling capabilities',
				isPositive: true,
			});
		}

		return insights;
	}

	get strengths(): string[] {
		const strengths: string[] = [];

		if (this.averageAutonomousScore > 20) {
			strengths.push('Strong autonomous performance');
		}
		if (this.averageTeleopScore > 30) {
			strengths.push('Excellent teleop scoring');
		}
		if (this.averageAlgaeScore > 15) {
			strengths.push('Great algae handling');
		}
		if (this.consistencyScore > 0.6) {
			strengths.push('Consistent performance');
		}
		if (this.bestScore > 80) {
			strengths.push('High scoring potential');
		}

		return strengths.length === 0 ? ['Developing team - potential for growth'] : strengths;
	}

	get weaknesses(): string[] {
		const weaknesses: string[] = [];

		if (this.averageAutonomousScore < 10) {
			weaknesses.push('Weak autonomous performance');
		}
		if (this.averageTeleopScore < 20) {
			weaknesses.push('Low teleop scoring');
		}
		if (this.averageAlgaeScore < 8) {
			weaknesses.push('Poor algae handling');
		}
		if (this.consistencyScore < 0.4) {
			weaknesses.push('Inconsistent performance');
		}

		return weaknesses.length === 0 ? ['Well-rounded team'] : weaknesses;
	}

	get recommendations(): string[] {
		const recommendations: string[] = [];

		if (this.averageAutonomousScore < 15) {
			recommendations.push('Focus on improving autonomous programming and strategy');
		}
		if (this.averageTeleopScore < 25) {
			recommendations.push('Work on teleop efficiency and driver coordination');
		}
		if (this.averageAlgaeScore < 10) {
			recommendations.push('Improve algae collection and processing mechanisms');
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
