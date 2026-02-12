import {action, makeObservable, observable} from "mobx";
import {initPitData} from "@ninjas-strategy/frc-games";
import {showSnackbar} from "@ninjas-strategy/ui";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import userStore from "@/lib/stores/userStore";
import {OfflineQueue} from "@/lib/OfflineQueue";

class PitStore {
	@observable data: Record<string, any> = {};
	@observable year: number = new Date().getFullYear();

	constructor() {
		makeObservable(this);
	}

	@action
	reset() {
		this.data = initPitData(this.year);
	}

	@action.bound
	startPit(year: number) {
		this.data = initPitData(year);
		this.year = year;
	}

	@action.bound
	updateValue(field: string, value: any) {
		this.data[field] = value;
	}

	@action.bound
	async submitToFirebase(teamNumber: string, eventId: string) {
		if (+teamNumber! <= 0 || !eventId) {
			showSnackbar('Team or event is missing.');
			return;
		}

		try {
			const teamRef = doc(db, 'events', eventId, 'pit', teamNumber);
			for (const pitField in this.data) {
				if (!this.data[pitField]) {
					delete this.data[pitField];
				}
			}
			await setDoc(teamRef, {
				...this.data,
				team_number: +teamNumber,
				timestamp: serverTimestamp(),
				scouter_id: userStore.user?.uid,
			});
			showSnackbar('Pit scouting data updated successfully!');
		} catch (e) {
			console.log(e);
			await OfflineQueue.saveUnsentGameData({
				...this.data,
				type: 'pit',
				team_number: +teamNumber,
				game_number: 0,
				eventId,
				scouter_id: userStore.user?.uid,
			});
			showSnackbar('No internet. Data will be sent automatically when online.');
		} finally {
			this.reset();
		}
	}
}

const store = new PitStore();
export default store;
