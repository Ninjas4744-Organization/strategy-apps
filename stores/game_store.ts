import {action, computed, makeAutoObservable, makeObservable, observable} from "mobx";
import {db} from "../lib/firebase/firestore";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {pick} from "../lib/utilities";
import {CageLevel} from "../interfaces/CageLevel";

class GameStore {
	autonomous_algae_processed: number = 0;
	autonomous_algae_net: number = 0;
	autonomous_processed_missed: number = 0;
	autonomous_net_missed: number = 0;
	autonomous_corals_right: number[] = [0, 0, 0, 0];
	autonomous_corals_left: number[] = [0, 0, 0, 0];

	algae_processed: number = 0;
	algae_net: number = 0;
	algae_processed_missed: number = 0;
	algae_net_missed: number = 0;
	corals_right: number[] = [0, 0, 0, 0];
	corals_left: number[] = [0, 0, 0, 0];

	cage_level: CageLevel = CageLevel.none;

	teamNumber: string = '';
	gameNumber: string = '';

	constructor() {
		makeObservable(this, {
			autonomous_algae_processed: observable,
			autonomous_algae_net: observable,
			autonomous_processed_missed: observable,
			autonomous_net_missed: observable,
			autonomous_corals_right: observable,
			autonomous_corals_left: observable,
			algae_processed: observable,
			algae_net: observable,
			algae_processed_missed: observable,
			algae_net_missed: observable,
			corals_right: observable,
			cage_level: observable,
			teamNumber: observable,
			gameNumber: observable,
			reset: action,
			gameData: computed,
			submitToFirebase: action.bound
		});
		this.reset();
	}

	reset() {
		this.autonomous_algae_processed = this.algae_processed = this.algae_processed_missed =
			this.autonomous_algae_net = this.algae_net = this.algae_net_missed =
				this.autonomous_processed_missed = this.autonomous_net_missed = 0;
		this.autonomous_corals_right = this.corals_right =
			this.autonomous_corals_left = this.corals_left = [0, 0, 0, 0];

		this.teamNumber = this.gameNumber = '';
	}

	get gameData() {
		return pick(this, [
			'autonomous_algae_processed',
			'algae_processed',
			'algae_net',
			'autonomous_algae_net',
			'autonomous_processed_missed',
			'autonomous_net_missed',
			'autonomous_corals_right',
			'autonomous_corals_left',
			'corals_right',
			'corals_left',
			'algae_processed_missed',
			'algae_net_missed',
			'cage_level',
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
		});
		this.reset();
	}
}

const store = new GameStore();
export default store;
