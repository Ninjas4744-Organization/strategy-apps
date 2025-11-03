import {action, makeObservable, observable} from "mobx";
import {Event} from "@/lib/models/Event";
import {collection, doc, getDocs, serverTimestamp, setDoc, addDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {showSnackbar} from "@ninjas-strategy/ui";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {TBA} from "@/lib/hooks/tba";
import {Router} from "expo-router";
import {getRandomString} from "@/lib/utilities";

type Events = {
	[eventId: string]: Event,
};

class AdminStore {
	@observable loaded: boolean = false;
	@observable events: Events = {};
	@observable isLoading: boolean = true;
	@observable error?: string;
	@observable showAppSettings: boolean = false;

	constructor() {
		makeObservable(this);
	}

	updateRegistrationSetting = async (enabled: boolean) => {
		try {
			await setDoc(doc(db, 'app_settings', 'registration'), {
				enabled,
				updated_at: serverTimestamp(),
			});
		} catch (e) {
			showSnackbar('Failed to updated registration setting: ' + e);
		}
	}

	@action.bound
	setShowAppSettings(show: boolean) {
		this.showAppSettings = show;
	}

	@action.bound
	async loadEvents() {
		this.isLoading = true;
		this.events = {};
		try {
			const eventsRef = collection(db, 'events');
			const eventsSnapshot = await getDocs(eventsRef);
			for (const eventDoc of eventsSnapshot.docs) {
				const eventData = eventDoc.data();
				const event = Event.fromMap(eventDoc.id, eventData);
				this.events[event.id] = Event.fromMap(eventDoc.id, eventData)
			}
		} catch (e) {
			this.error = `Failed to load events: ${e}`;
		} finally {
			this.loaded = true;
			this.isLoading = false;
		}
	}

	@action.bound
	async createEvent(name: string, eventData: TBAEventSimple, router: Router) {
		try {
			const eventsRef = collection(db, 'events');
			const eventRef = await addDoc(eventsRef, {eventName: name, ...eventData});
			const teamsRes = await TBA(`/event/${eventData.key}/teams/keys`);
			for (const team of teamsRes.data) {
				const [, teamNumber] = team.split('frc');
				await setDoc(doc(db, eventRef.path + '/teams', teamNumber), {
					memberRegistrationCode: getRandomString(10),
					adminRegistrationCode: getRandomString(10),
				});
			}
		} catch (e) {
			this.error = `Failed to create event: ${e}`;
		} finally {
			this.loadEvents();
			router.back();
		}
	}
}

export default new AdminStore();
