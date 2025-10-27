import {Timestamp} from 'firebase/firestore';
import {CageLevel} from "@/interfaces/CageLevel";
import {Model} from "@/interfaces/Model";

export class Game implements Model {
	constructor(
		public id: string,
		public teamNumber: number,
		public gameNumber: string,
		public timestamp: Date,

		// Teleop Corals
		public coralsMissed: number,
		public coralsScoredL1: number,
		public coralsScoredL2: number,
		public coralsScoredL3: number,
		public coralsScoredL4: number,

		// Autonomous Corals
		public autonomousCoralsMissed: number,
		public autonomousCoralsScoredL1: number,
		public autonomousCoralsScoredL2: number,
		public autonomousCoralsScoredL3: number,
		public autonomousCoralsScoredL4: number,

		// Algae
		public algaeProcessed: number,
		public algaeNet: number,
		public algaeProcessedMissed: number,
		public algaeNetMissed: number,
		public autonomousAlgaeProcessed: number,
		public autonomousAlgaeNet: number,
		public autonomousAlgaeProcessedMissed: number,
		public autonomousAlgaeNetMissed: number,

		// Cage
		public cageLevel: CageLevel,
	) {}

	static fromMap(id: string, data: Record<string, any>): Game {
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

		// corals_right: [L1, L2, L3, L4]
		const coralsRight = data['corals_right'] as number[] | undefined;
		const coralsScoredL1 = coralsRight?.[0] ?? 0;
		const coralsScoredL2 = coralsRight?.[1] ?? 0;
		const coralsScoredL3 = coralsRight?.[2] ?? 0;
		const coralsScoredL4 = coralsRight?.[3] ?? 0;

		// autonomous_corals_right: [L1, L2, L3, L4]
		const autonomousCoralsRight = data['autonomous_corals_right'] as number[] | undefined;
		const autonomousCoralsScoredL1 = autonomousCoralsRight?.[0] ?? 0;
		const autonomousCoralsScoredL2 = autonomousCoralsRight?.[1] ?? 0;
		const autonomousCoralsScoredL3 = autonomousCoralsRight?.[2] ?? 0;
		const autonomousCoralsScoredL4 = autonomousCoralsRight?.[3] ?? 0;

		return new Game(
			id,
			teamNumber,
			data['game_number'] ?? '',
			(data['timestamp'] instanceof Timestamp
					? data['timestamp'].toDate()
					: new Date()) ?? new Date(),
			data['corals_missed'] ?? 0,
			coralsScoredL1,
			coralsScoredL2,
			coralsScoredL3,
			coralsScoredL4,
			data['autonomus_corals_missed'] ?? 0,
			autonomousCoralsScoredL1,
			autonomousCoralsScoredL2,
			autonomousCoralsScoredL3,
			autonomousCoralsScoredL4,
			data['algae_processed'] ?? 0,
			data['algae_net'] ?? 0,
			data['algae_processed_missed'] ?? 0,
			data['algae_net_missed'] ?? 0,
			data['autonomous_algae_processed'] ?? 0,
			data['autonomous_algae_net'] ?? 0,
			data['autonomous_algae_processed_missed'] ?? 0,
			data['autonomous_algae_net_missed'] ?? 0,
			data['cage_level']
		);
	}

	toMap(): Record<string, any> {
		return {
			team_number: this.teamNumber,
			game_number: this.gameNumber,
			timestamp: this.timestamp,
			corals_missed: this.coralsMissed,
			corals_right: [
				this.coralsScoredL1,
				this.coralsScoredL2,
				this.coralsScoredL3,
				this.coralsScoredL4,
			],
			autonomus_corals_missed: this.autonomousCoralsMissed,
			autonomous_corals_right: [
				this.autonomousCoralsScoredL1,
				this.autonomousCoralsScoredL2,
				this.autonomousCoralsScoredL3,
				this.autonomousCoralsScoredL4,
			],
			algae_processed: this.algaeProcessed,
			algae_net: this.algaeNet,
			algae_processed_missed: this.algaeProcessedMissed,
			algae_net_missed: this.algaeNetMissed,
			autonomous_algae_processed: this.autonomousAlgaeProcessed,
			autonomous_algae_net: this.autonomousAlgaeNet,
			autonomous_algae_processed_missed: this.autonomousAlgaeProcessedMissed,
			autonomous_algae_net_missed: this.autonomousAlgaeNetMissed,
			cage_level: this.cageLevel,
		};
	}

	// Calculated scores
	get teleopCoralScore(): number {
		return this.coralsScoredL4 * 5 + this.coralsScoredL3 * 3 + this.coralsScoredL2 * 2 + this.coralsScoredL1 * 1;
	}

	get autonomousCoralScore(): number {
		return (
			this.autonomousCoralsScoredL4 * 5 +
			this.autonomousCoralsScoredL3 * 3 +
			this.autonomousCoralsScoredL2 * 2 +
			this.autonomousCoralsScoredL1 * 1
		);
	}

	get teleopAlgaeScore(): number {
		return this.algaeProcessed * 1 + this.algaeNet * 2;
	}

	get autonomousAlgaeScore(): number {
		return this.autonomousAlgaeProcessed * 1 + this.autonomousAlgaeNet * 2;
	}

	get teleopScore(): number {
		return this.teleopCoralScore + this.teleopAlgaeScore;
	}

	get autonomousScore(): number {
		return this.autonomousCoralScore + this.autonomousAlgaeScore;
	}

	// Cage level scoring - Park: 2, Shallow: 6, Deep: 12 points
	get parkingScore(): number {
		switch (this.cageLevel) {
			case CageLevel.PARK:
				return 2;
			case CageLevel.SHALOW:
				return 6;
			case CageLevel.DEEP:
				return 12;
			default:
				return 0;
		}
	}

	get totalScore(): number {
		return this.teleopScore + this.autonomousScore + this.parkingScore;
	}

	get algaeScore(): number {
		return this.teleopAlgaeScore + this.autonomousAlgaeScore;
	}
}
