import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection, DocumentData, QueryDocumentSnapshot} from "firebase/firestore";
import {type Subscription} from "rxjs";
import {showSnackbar} from "@ninjas-strategy/ui";
import {db} from "@/lib/firebase/firestore";
import {EventMatch} from "@/lib/models/EventMatch";
import {observeCollection} from "@/lib/utilities";

type EventMatches = {
	[matchId: string]: EventMatch;
};

class EventMatchesStore {
	isLoading: boolean = false;
	error: string | null = null;
	matches: EventMatches = {};
	private subscription: Subscription | null = null;
	private subscribedEventId: string | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			error: observable,
			matches: observable.ref,
			subscribeForEvent: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyMatches: action.bound,
			matchesList: computed,
			qualificationMatchesList: computed,
			practiceMatchesList: computed,
		});
	}

	reset() {
		this.isLoading = false;
		this.error = null;
		this.matches = {};
		this.subscribedEventId = null;
	}

	applyMatches(eventId: string, docs: QueryDocumentSnapshot<DocumentData>[]) {
		const nextMatches: EventMatches = {};
		for (const matchDoc of docs) {
			const match = EventMatch.fromMap(matchDoc.id, eventId, matchDoc.data());
			nextMatches[match.id] = match;
		}
		this.matches = nextMatches;
		this.isLoading = false;
		this.error = null;
	}

	subscribeForEvent(eventId: string) {
		this.unsubscribe();

		if (!eventId) {
			this.reset();
			return;
		}

		this.subscribedEventId = eventId;
		this.isLoading = true;
		this.subscription = observeCollection(collection(db, 'events', eventId, 'matches')).subscribe({
			next: matches => {
				runInAction(() => this.applyMatches(eventId, matches));
			},
			error: error => {
				console.error('[EventMatchesStore] subscribeForEvent:error', {
					eventId,
					error,
					message: error?.message,
				});
				showSnackbar(`Failed to load match schedule: ${error.message}`);
				runInAction(() => {
					this.error = error.message;
					this.isLoading = false;
					this.matches = {};
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

	get matchesList() {
		return Object.values(this.matches)
			.sort((a, b) => {
				const typeCompare = matchTypeSortValue(a) - matchTypeSortValue(b);
				return typeCompare || Number(a.matchNumber) - Number(b.matchNumber);
			});
	}

	get qualificationMatchesList() {
		return this.matchesList.filter(match => match.matchType === "qualification");
	}

	get practiceMatchesList() {
		return this.matchesList.filter(match => match.matchType === "practice");
	}
}

function matchTypeSortValue(match: EventMatch) {
	return match.matchType === "practice" ? 0 : 1;
}

const eventMatchesStore = new EventMatchesStore();
export default eventMatchesStore;
