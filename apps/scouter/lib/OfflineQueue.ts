import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {doc, setDoc, collection, serverTimestamp, getDoc} from 'firebase/firestore';
import {db} from "@/lib/firebase/firestore";
import {showSnackbar} from "@ninjas-strategy/ui";

type BaseQueuedData = {
	team_number: number;
	eventId: string;
	scouter_id?: string;
	[key: string]: unknown;
};

type QueuedGameData = BaseQueuedData & {
	type: 'game';
	game_number: number;
};

type QueuedPitData = BaseQueuedData & {
	type: 'pit';
	game_number?: 0;
};

type QueuedData = QueuedGameData | QueuedPitData;

const STORAGE_KEY = 'unsent_games';

const toFirestoreData = (item: QueuedData): Record<string, unknown> => {
	const firestoreData: Record<string, unknown> = {...item};
	delete firestoreData.type;
	delete firestoreData.eventId;
	return firestoreData;
};

export class OfflineQueue {
	static async saveUnsentGameData(data: QueuedData) {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const parsed: QueuedData[] = stored ? JSON.parse(stored) : [];
			parsed.push(data);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
		} catch (err) {
			console.error('Failed to save unsent data', err);
		}
	}

	static async resendUnsentGameData() {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const unsent: QueuedData[] = stored ? JSON.parse(stored) : [];
			if (unsent.length === 0) return;

			let sentAny = false;
			let skippedDuplicates = 0;
			const remaining: QueuedData[] = [];

			for (const item of unsent) {
				try {
					if (item.type === 'game') {
						const teamDoc = doc(collection(db, 'events', item.eventId, 'teams'), item.team_number.toString());
						const gameDoc = doc(collection(teamDoc, 'games'), item.game_number.toString());
						const gameSnap = await getDoc(gameDoc);
						const firestoreData = toFirestoreData(item);

						if (gameSnap.exists()) {
							skippedDuplicates++;
							continue;
						}

						await setDoc(gameDoc, {
							...firestoreData,
							timestamp: serverTimestamp()
						});
						sentAny = true;
					} else if (item.type === 'pit') {
						const teamRef = doc(db, 'events', item.eventId, 'pit', item.team_number.toString());
						const firestoreData = toFirestoreData(item);
						await setDoc(teamRef, {
							...firestoreData,
							timestamp: serverTimestamp(),
						});
						sentAny = true;
					}
				} catch (e) {
					console.warn('Failed to resend item:', e);
					remaining.push(item);
				}
			}

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

			if (sentAny) {
				showSnackbar('Offline data sent to Firebase!');
			}
			if (skippedDuplicates) {
				showSnackbar(`${skippedDuplicates} offline match ${skippedDuplicates === 1 ? 'submission was' : 'submissions were'} skipped because data already exists.`);
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
