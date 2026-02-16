import {action, makeObservable, observable, runInAction} from "mobx";
import {collection, doc, query, setDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserType} from "@/lib/interfaces/UserType";
import {Event} from "@/lib/models/Event";
import userStore from "@/lib/stores/userStore";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {Router} from "expo-router";
import {TBA} from "@/lib/hooks/tba";
import {showSnackbar} from "@ninjas-strategy/ui";
import {type Subscription} from "rxjs";
import {observeCollection} from "@/lib/utilities";

type Events = {
	[eventId: string]: Event;
};

class EventsStore {
	@observable isLoading: boolean = true;
	@observable events: Events = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this);
	}

	@action.bound
	subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (!userStore.userData && !userStore.user?.isAnonymous)
			return;

		let eventsRef = query(collection(db, 'events'));
		if (userStore.user?.isAnonymous) {
			eventsRef = query(eventsRef, where('event_code', '==', 'demo'));
		} else if (userStore.userData?.type !== UserType.APP_ADMIN) {
			eventsRef = query(eventsRef, where('teams', 'array-contains', `frc${userStore.userData?.team}`));
		}

		this.isLoading = true;
		const $events = observeCollection(eventsRef);
		this.subscription = $events.subscribe(events => {
			runInAction(() => {
				for (const eventDoc of events) {
					const eventData = eventDoc.data();
					const event = Event.fromMap(eventDoc.id, eventData);
					this.events[event.id] = Event.fromMap(eventDoc.id, eventData)
				}
				this.isLoading = false;
			})
		});
	}

	@action.bound
	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
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
