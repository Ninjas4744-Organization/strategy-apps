import {action, makeObservable, observable} from "mobx";
import {initPitData} from "@ninjas-strategy/frc-games";
import {showSnackbar} from "@ninjas-strategy/ui";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";
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

	async submitToFirebase(teamNumber: string, eventId: string): Promise<boolean> {
		if (userStore.user?.isAnonymous) {
			showSnackbar('Pit scouting data updated successfully!');
			this.reset();
			return true;
		}
		if (+teamNumber <= 0 || !eventId) {
			showSnackbar('Team or event is missing.');
			return false;
		}

		try {
			const eventRef = doc(db, 'events', eventId);
			const eventSnap = await getDoc(eventRef);
			if (!eventSnap.exists() || eventSnap.data().active === false) {
				showSnackbar('This event is closed for new reports.');
				return false;
			}

			const activeUserRef = doc(db, 'events', eventId, 'activeUsers', userStore.user?.uid ?? '');
			const activeUserSnap = await getDoc(activeUserRef);
			if (!activeUserSnap.exists() || activeUserSnap.data().active !== true) {
				showSnackbar('You are not active for this event.');
				return false;
			}

			const teamRef = doc(db, 'events', eventId, 'pit', teamNumber);
			const data = Object.fromEntries(Object.entries(this.data).filter(([, value]) => !!value));
			await setDoc(teamRef, {
				...data,
				team_number: +teamNumber,
				timestamp: serverTimestamp(),
				scouter_id: userStore.user?.uid,
			});
			showSnackbar('Pit scouting data updated successfully!');
			this.reset();
			return true;
		} catch (e) {
			console.warn(e);
			await OfflineQueue.saveUnsentGameData({
				...this.data,
				type: 'pit',
				team_number: +teamNumber,
				game_number: 0,
				eventId,
				scouter_id: userStore.user?.uid,
			});
			showSnackbar('No internet. Data will be sent automatically when online.');
			this.reset();
			return true;
		}
	}
}

const store = new PitStore();
export default store;
