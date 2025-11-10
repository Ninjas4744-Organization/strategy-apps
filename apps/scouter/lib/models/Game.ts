import {Timestamp} from 'firebase/firestore';
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {Model} from "@/lib/interfaces/Model";

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

		const coralsScoredL1 = data['corals_scored_l1'] ?? 0;
		const coralsScoredL2 = data['corals_scored_l2'] ?? 0;
		const coralsScoredL3 = data['corals_scored_l3'] ?? 0;
		const coralsScoredL4 = data['corals_scored_l4'] ?? 0;

		const autonomousCoralsScoredL1 = data['autonomous_corals_scored_l1'] ?? 0;
		const autonomousCoralsScoredL2 = data['autonomous_corals_scored_l1'] ?? 0;
		const autonomousCoralsScoredL3 = data['autonomous_corals_scored_l1'] ?? 0;
		const autonomousCoralsScoredL4 = data['autonomous_corals_scored_l1']?? 0;

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
			corals_scored_l1: this.coralsScoredL1,
			corals_scored_l2: this.coralsScoredL2,
			corals_scored_l3: this.coralsScoredL3,
			corals_scored_l4: this.coralsScoredL4,
			autonomous_corals_missed: this.autonomousCoralsMissed,
			autonomous_corals_scored_l1: this.autonomousCoralsScoredL1,
			autonomous_corals_scored_l2: this.autonomousCoralsScoredL2,
			autonomous_corals_scored_l3: this.autonomousCoralsScoredL3,
			autonomous_corals_scored_l4: this.autonomousCoralsScoredL4,
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
			case CageLevel.SHALLOW:
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
