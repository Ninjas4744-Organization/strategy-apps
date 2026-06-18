import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {doc, type DocumentSnapshot, type DocumentData} from "firebase/firestore";
import {type Subscription} from "rxjs";
import {db} from "@/lib/firebase/firestore";
import {observeDoc} from "@/lib/utilities";
import userStore from "@/lib/stores/userStore";

type EventAccess = {
	[eventId: string]: boolean;
};

class EventReportAccessStore {
	isLoading: boolean = false;
	access: EventAccess = {};
	private subscriptions: Subscription[] = [];

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			access: observable.ref,
			subscribeForEvents: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyAccessDoc: action.bound,
			reportableEventIds: computed,
		});
	}

	reset() {
		this.access = {};
		this.isLoading = false;
	}

	applyAccessDoc(eventId: string, snapshot: DocumentSnapshot<DocumentData>) {
		this.access = {
			...this.access,
			[eventId]: snapshot.exists() && snapshot.data().active === true,
		};
		this.isLoading = false;
	}

	subscribeForEvents(eventIds: string[]) {
		this.unsubscribe();

		const userId = userStore.user?.uid;
		if (!userId || userStore.user?.isAnonymous || eventIds.length === 0) {
			this.reset();
			return;
		}

		this.isLoading = true;
		this.access = {};
		this.subscriptions = eventIds.map(eventId => observeDoc(doc(db, 'events', eventId, 'activeUsers', userId)).subscribe({
			next: snapshot => {
				runInAction(() => this.applyAccessDoc(eventId, snapshot));
			},
			error: () => {
				runInAction(() => this.applyAccessDoc(eventId, {exists: () => false} as DocumentSnapshot<DocumentData>));
			},
		}));
	}

	unsubscribe() {
		for (const subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
		this.subscriptions = [];
		this.reset();
	}

	canReport(eventId: string) {
		return this.access[eventId] === true;
	}

	get reportableEventIds() {
		return Object.entries(this.access)
			.filter(([, canReport]) => canReport)
			.map(([eventId]) => eventId);
	}
}

const eventReportAccessStore = new EventReportAccessStore();
export default eventReportAccessStore;
