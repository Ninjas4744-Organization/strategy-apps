import {action, makeObservable, observable, runInAction} from "mobx";
import {collection, doc, DocumentData, QueryDocumentSnapshot, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserType} from "@/lib/interfaces/UserType";
import {Event} from "@/lib/models/Event";
import userStore from "@/lib/stores/userStore";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {TBA} from "@/lib/hooks/tba";
import {showSnackbar} from "@ninjas-strategy/ui";
import {type Subscription} from "rxjs";
import {observeCollection} from "@/lib/utilities";

type Events = {
	[eventId: string]: Event;
};

type RouterLike = {
	back: () => void;
};

class EventsStore {
	isLoading: boolean = true;
	events: Events = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			events: observable.ref,
			subscribe: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyEvents: action.bound,
			createEvent: action.bound,
			setEventActive: action.bound,
		});
	}

	reset() {
		this.events = {};
		this.isLoading = false;
	}

	applyEvents(docs: QueryDocumentSnapshot<DocumentData>[]) {
		const nextEvents: Events = {};
		for (const eventDoc of docs) {
			const eventData = eventDoc.data();
			const event = Event.fromMap(eventDoc.id, eventData);
			nextEvents[event.id] = event;
		}
		this.events = nextEvents;
		this.isLoading = false;
	}

	subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}

		const userData = userStore.userData;
		if (!userData && !userStore.user?.isAnonymous) {
			this.reset();
			return;
		}

		let eventsRef = query(collection(db, 'events'));
		if (userStore.user?.isAnonymous) {
			eventsRef = query(eventsRef, where('event_code', '==', 'demo'));
		} else if (userData?.type !== UserType.APP_ADMIN) {
			eventsRef = query(eventsRef, where('teams', 'array-contains', `frc${userData?.team}`));
		}

		if (!userStore.user?.isAnonymous) {
			eventsRef = query(eventsRef, where('event_code', '!=', 'demo'));
		}

		this.isLoading = true;
		const $events = observeCollection(eventsRef);
		this.subscription = $events.subscribe({
			next: events => {
				runInAction(() => {
					this.applyEvents(events);
				})
			},
			error: error => {
				showSnackbar(`Failed to load events: ${error.message}`);
				runInAction(() => {
					this.events = {};
					this.isLoading = false;
				});
			},
		});
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
		this.reset();
	}

	async createEvent(eventData: TBAEventSimple, router: RouterLike) {
		try {
			const teamsRes = await TBA(`/event/${eventData.key}/teams/keys`);
			const eventsRef = doc(db, 'events', eventData.key);
			await setDoc(eventsRef, {
				...eventData,
				teams: teamsRes.data,
				active: true,
			});
		} catch (e) {
			showSnackbar(`Failed to create event: ${e}`);
		} finally {
			router.back();
		}
	}

	async setEventActive(eventId: string, active: boolean) {
		try {
			await updateDoc(doc(db, 'events', eventId), {active});
			showSnackbar(active ? 'Event reopened for reports.' : 'Event closed for new reports.');
		} catch (e) {
			showSnackbar(`Failed to update event: ${e}`);
		}
	}
}

const eventsStore = new EventsStore();
export default eventsStore;
