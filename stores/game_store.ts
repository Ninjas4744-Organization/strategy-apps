import {makeAutoObservable, makeObservable} from "mobx";
import {db} from "../lib/firebase/firestore";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {pick} from "../lib/utilities";

type GameState = {
	algaeProcessed: number;
	algaeNet: number;
	coralsRight: Array<number>;
	coralsLeft: Array<number>;
};

class GameStore {
	autonomous_algae_processed?: number;
	autonomous_algae_net?: number;
	autonomous_corals_right?: Array<number>;
	autonomous_corals_left?: Array<number>;

	algae_processed?: number;
	algae_net?: number;
	corals_right?: Array<number>;
	corals_left?: Array<number>;

	teamNumber?: string;
	gameNumber?: string;

	constructor() {
		makeAutoObservable(this);
		this.reset();
	}

	reset() {
		this.autonomous_algae_processed = this.algae_processed =
			this.autonomous_algae_net = this.algae_net = 0;
		this.autonomous_corals_right = this.corals_right =
			this.autonomous_corals_left = this.corals_left = [0, 0, 0, 0];

		this.teamNumber = this.gameNumber = '';
	}

	gameData() {
		return pick(this, [
			'autonomous_algae_processed',
			'algae_processed',
			'autonomous_algae_net',
			'algae_net',
			'autonomous_corals_right',
			'corals_right',
			'autonomous_corals_left',
			'corals_left',
		]);
	}

	async submitToFirebase() {
		if (+this.teamNumber! <= 0 || +this.gameNumber! <= 0)
			return;
		const teamRef = doc(db, 'teams', this.teamNumber!);
		const teamSnap = await getDoc(teamRef);
		if (!teamSnap.exists())
			await setDoc(teamRef, {
				team_number: +this.teamNumber!
			});
		const gameRef = doc(teamRef, 'games', this.gameNumber!);
		await setDoc(gameRef, {
			...this.gameData,
			team_number: this.teamNumber,
			game_number: this.gameNumber,
			timestamp: serverTimestamp()
		})
	}
}

const store = new GameStore();
export default store;
