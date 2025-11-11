import {action, makeObservable, observable} from "mobx";
import {db} from "@/lib/firebase/firestore";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {showSnackbar} from "@ninjas-strategy/ui";
import userStore from "@/lib/stores/userStore";
import {initGameData} from "@ninjas-strategy/frc-games";

const MAX_TEAM_NUMBER = 20000;
const MAX_QUALIFICATION_MATCH_NUMBER = 150;

class GameStore {
	@observable data: Record<string, any> = {};

	@observable teamNumber: string = '';
	@observable gameNumber: string = '';

	constructor() {
		makeObservable(this);
		this.reset();
	}

	@action
	reset() {
		this.data = initGameData(2025);
		this.teamNumber = this.gameNumber = '';
	}

	@action.bound
	updateValue(field: string, value: any) {
		this.data[field] = value;
	}

	@action.bound
	async submitToFirebase(eventId: string) {
		if (+this.teamNumber! <= 0 || +this.gameNumber! <= 0) {
			showSnackbar('Team or game number is missing.');
			return;
		}
		if (+this.teamNumber < 0 || +this.gameNumber < 0 || +this.teamNumber > MAX_TEAM_NUMBER || +this.gameNumber > MAX_QUALIFICATION_MATCH_NUMBER) {
			showSnackbar('Invalid game of team number.');
			return;
		}
		try {
			const teamRef = doc(db, 'events', eventId, 'teams', this.teamNumber!);
			const teamSnap = await getDoc(teamRef);
			if (!teamSnap.exists())
				await setDoc(teamRef, {
					team_number: +this.teamNumber!
				});
			const gameRef = doc(teamRef, 'games', this.gameNumber!);
			await setDoc(gameRef, {
				...this.data,
				team_number: this.teamNumber,
				game_number: this.gameNumber,
				scouter_id: userStore.user?.uid,
				timestamp: serverTimestamp()
			});
			showSnackbar('Data sent! Starting new match...');
		} catch (e) {
			await OfflineQueue.saveUnsentGameData({
				...this.data,
				team_number: +this.teamNumber,
				game_number: +this.gameNumber,
				scouter_id: userStore.user?.uid,
				eventId,
			});
			showSnackbar('No internet. Data will be sent automatically when online.');
		} finally {
			this.reset();
		}
	}
}

const store = new GameStore();
export default store;
