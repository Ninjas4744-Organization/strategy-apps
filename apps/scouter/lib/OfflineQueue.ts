import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {doc, setDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db} from "@/lib/firebase/firestore";
import {showSnackbar} from "@ninjas-strategy/ui/Snackbar";

type GameData = {
	team_number: number;
	game_number: number;
	[key: string]: any;
};

const STORAGE_KEY = 'unsent_games';

export class OfflineQueue {
	static async saveUnsentGameData(data: GameData) {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const parsed: GameData[] = stored ? JSON.parse(stored) : [];
			parsed.push(data);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
		} catch (err) {
			console.error('Failed to save unsent data', err);
		}
	}

	static async resendUnsentGameData() {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const unsent: GameData[] = stored ? JSON.parse(stored) : [];
			if (unsent.length === 0) return;

			let sentAny = false;
			const remaining: GameData[] = [];

			for (const data of unsent) {
				try {
					const teamDoc = doc(collection(db, 'teams'), data.team_number.toString());
					const gameDoc = doc(collection(teamDoc, 'games'), data.game_number.toString());

					await setDoc(gameDoc, {
						...data,
						timestamp: serverTimestamp()
					});
					sentAny = true;
				} catch (e) {
					console.warn('Failed to resend item:', e);
					remaining.push(data);
				}
			}

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

			if (sentAny) {
				showSnackbar('Offline data sent to Firebase!');
			}
		} catch (err) {
			console.error('Failed to resend unsent data', err);
		}
	}

	static listenForConnectivityAndResend() {
		NetInfo.addEventListener(state => {
			if (state.isConnected) {
				this.resendUnsentGameData();
			}
		});
	}
}
