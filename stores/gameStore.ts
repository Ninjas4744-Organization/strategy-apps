import {action, computed, makeObservable, observable} from "mobx";
import {db} from "@/lib/firebase/firestore";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {pick} from "@/lib/utilities";
import {CageLevel} from "@/interfaces/CageLevel";

class GameStore {
	@observable autonomous_algae_processed: number = 0;
	@observable autonomous_algae_net: number = 0;
	@observable autonomous_processed_missed: number = 0;
	@observable autonomous_net_missed: number = 0;
	@observable autonomous_corals_right: number[] = [0, 0, 0, 0];
	@observable autonomous_corals_left: number[] = [0, 0, 0, 0];

	@observable algae_processed: number = 0;
	@observable algae_net: number = 0;
	@observable algae_processed_missed: number = 0;
	@observable algae_net_missed: number = 0;
	@observable corals_right: number[] = [0, 0, 0, 0];
	@observable corals_left: number[] = [0, 0, 0, 0];

	@observable cage_level: CageLevel = CageLevel.NONE;

	@observable teamNumber: string = '';
	@observable gameNumber: string = '';

	constructor() {
		makeObservable(this);
		this.reset();
	}

	@action
	reset() {
		this.autonomous_algae_processed = this.algae_processed = this.algae_processed_missed =
			this.autonomous_algae_net = this.algae_net = this.algae_net_missed =
				this.autonomous_processed_missed = this.autonomous_net_missed = 0;
		this.autonomous_corals_right = this.corals_right =
			this.autonomous_corals_left = this.corals_left = [0, 0, 0, 0];

		this.teamNumber = this.gameNumber = '';
	}

	@computed
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

	@action.bound
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
