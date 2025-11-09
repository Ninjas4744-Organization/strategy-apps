import {action, makeObservable, observable, runInAction} from "mobx";
import {collection, doc, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserType} from "@/lib/interfaces/UserType";
import {Event} from "@/lib/models/Event";
import userStore from "@/lib/stores/userStore";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {Router} from "expo-router";
import {TBA} from "@/lib/hooks/tba";
import {showSnackbar} from "@ninjas-strategy/ui";

type Events = {
	[eventId: string]: Event;
};

class EventsStore {
	@observable isLoading: boolean = true;
	@observable events: Events = {};
	private eventsUnsubscribe: (() => void) | null = null;

	constructor() {
		makeObservable(this);
	}

	@action.bound
	subscribe() {
		if (this.eventsUnsubscribe) {
			this.eventsUnsubscribe();
		}

		if (!userStore.userData)
			return;

		let eventsRef = query(collection(db, 'events'));
		if (userStore.userData.type !== UserType.APP_ADMIN)
			eventsRef = query(eventsRef, where('teams', 'array-contains', `frc${userStore.userData.team}`));

		this.isLoading = true;
		this.eventsUnsubscribe = onSnapshot(eventsRef, snapshot => {
			runInAction(() => {
				for (const eventDoc of snapshot.docs) {
					const eventData = eventDoc.data();
					const event = Event.fromMap(eventDoc.id, eventData);
					this.events[event.id] = Event.fromMap(eventDoc.id, eventData)
				}
				this.isLoading = false;
			})
		})
	}

	@action.bound
	unsubscribe() {
		if (this.eventsUnsubscribe) {
			this.eventsUnsubscribe();
			this.eventsUnsubscribe = null;
		}
	}

	@action.bound
	async createEvent(eventData: TBAEventSimple, router: Router) {
		try {
			const teamsRes = await TBA(`/event/${eventData.key}/teams/keys`);
			const eventsRef = doc(db, 'events', eventData.key);
			await setDoc(eventsRef, {
				...eventData,
				teams: teamsRes.data,
			});
		} catch (e) {
			showSnackbar(`Failed to create event: ${e}`);
		} finally {
			router.back();
		}
	}
}

const eventsStore = new EventsStore();
export default eventsStore;
