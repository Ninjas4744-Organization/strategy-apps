import {action, makeObservable, observable} from "mobx";
import {db} from "@/lib/firebase/firestore";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {showSnackbar} from "@ninjas-strategy/ui";
import userStore from "@/lib/stores/userStore";
import {initGameData} from "@ninjas-strategy/frc-games";

export const MAX_TEAM_NUMBER = 20000;
export const MAX_QUALIFICATION_MATCH_NUMBER = 150;

class GameStore {
	data: Record<string, any> = {};

	teamNumber: string = '';
	gameNumber: string = '';
	year: number = new Date().getFullYear();

	constructor() {
		makeObservable(this, {
			data: observable,
			teamNumber: observable,
			gameNumber: observable,
			year: observable,
			reset: action,
			startGame: action.bound,
			updateValue: action.bound,
			submitToFirebase: action.bound,
		});
	}

	reset() {
		this.data = initGameData(this.year);
		this.teamNumber = this.gameNumber = '';
	}

	startGame(teamNumber: string, gameNumber: string, year: number) {
		this.data = initGameData(year);
		this.teamNumber = teamNumber;
		this.gameNumber = gameNumber;
		this.year = year;
	}

	updateValue(field: string, value: any) {
		this.data[field] = value;
	}

	async submitToFirebase(eventId: string): Promise<boolean> {
		if (userStore.user?.isAnonymous) {
			showSnackbar('Data sent! Starting new match...');
			this.reset();
			return true;
		}
		if (+this.teamNumber <= 0 || +this.gameNumber <= 0) {
			showSnackbar('Team or game number is missing.');
			return false;
		}
		if (+this.teamNumber < 0 || +this.gameNumber < 0 || +this.teamNumber > MAX_TEAM_NUMBER || +this.gameNumber > MAX_QUALIFICATION_MATCH_NUMBER) {
			showSnackbar('Invalid team or match number.');
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

			const teamRef = doc(db, 'events', eventId, 'teams', this.teamNumber);
			const teamSnap = await getDoc(teamRef);
			if (!teamSnap.exists())
				await setDoc(teamRef, {
					team_number: +this.teamNumber
				});
			const gameRef = doc(teamRef, 'games', this.gameNumber);
			const gameSnap = await getDoc(gameRef);
			if (gameSnap.exists()) {
				showSnackbar(`Team ${this.teamNumber} match ${this.gameNumber} already has scouting data.`);
				return false;
			}

			await setDoc(gameRef, {
				...this.data,
				team_number: this.teamNumber,
				game_number: this.gameNumber,
				scouter_id: userStore.user?.uid,
				timestamp: serverTimestamp()
			});
			showSnackbar('Data sent! Starting new match...');
			this.reset();
			return true;
		} catch (e) {
			await OfflineQueue.saveUnsentGameData({
				...this.data,
				type: 'game',
				team_number: +this.teamNumber,
				game_number: +this.gameNumber,
				scouter_id: userStore.user?.uid,
				eventId,
			});
			showSnackbar('No internet. Data will be sent automatically when online.');
			this.reset();
			return true;
		}
	}
}

const store = new GameStore();
export default store;
