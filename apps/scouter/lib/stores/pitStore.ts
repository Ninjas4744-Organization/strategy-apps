import {action, makeObservable, observable} from "mobx";
import {initPitData} from "@ninjas-strategy/frc-games";
import {showSnackbar} from "@ninjas-strategy/ui";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import userStore from "@/lib/stores/userStore";
import {OfflineQueue} from "@/lib/OfflineQueue";

class PitStore {
	data: Record<string, any> = {};
	year: number = new Date().getFullYear();

	constructor() {
		makeObservable(this, {
			data: observable,
			year: observable,
			reset: action,
			startPit: action.bound,
			updateValue: action.bound,
			submitToFirebase: action.bound,
		});
	}

	reset() {
		this.data = initPitData(this.year);
	}

	startPit(year: number) {
		this.data = initPitData(year);
		this.year = year;
	}

	updateValue(field: string, value: any) {
		this.data[field] = value;
	}

	async submitToFirebase(teamNumber: string, eventId: string) {
		if (userStore.user?.isAnonymous) {
			showSnackbar('Pit scouting data updated successfully!');
			this.reset();
			return;
		}
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
