import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, setDoc} from "firebase/firestore";
import {type Subscription} from "rxjs";
import {db} from "@/lib/firebase/firestore";
import {observeCollection} from "@/lib/utilities";
import {showSnackbar} from "@ninjas-strategy/ui";
import userStore from "@/lib/stores/userStore";
import {type TeamUser} from "@/lib/stores/teamUsersStore";

type EventActiveUser = {
	id: string;
	active: boolean;
	team?: number;
	userName?: string;
	userType?: string;
};

type EventActiveUsers = {
	[userId: string]: EventActiveUser;
};

class EventActiveUsersStore {
	isLoading: boolean = false;
	activeUsers: EventActiveUsers = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			activeUsers: observable.ref,
			subscribeForEvent: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyActiveUsers: action.bound,
			setUserActive: action.bound,
			activeUserIds: computed,
			isCurrentUserActive: computed,
		});
	}

	reset() {
		this.activeUsers = {};
		this.isLoading = false;
	}

	applyActiveUsers(docs: QueryDocumentSnapshot<DocumentData>[]) {
		const nextActiveUsers: EventActiveUsers = {};
		for (const activeUserDoc of docs) {
			const data = activeUserDoc.data();
			nextActiveUsers[activeUserDoc.id] = {
				id: activeUserDoc.id,
				active: data.active === true,
				team: data.team,
				userName: data.user_name,
				userType: data.user_type,
			};
		}
		this.activeUsers = nextActiveUsers;
		this.isLoading = false;
	}

	subscribeForEvent(eventId: string) {
		this.unsubscribe();

		if (!eventId) {
			this.reset();
			return;
		}

		this.isLoading = true;
		this.subscription = observeCollection(collection(db, 'events', eventId, 'activeUsers')).subscribe({
			next: activeUsers => {
				runInAction(() => this.applyActiveUsers(activeUsers));
			},
			error: error => {
				showSnackbar(`Failed to load event users: ${error.message}`);
				runInAction(() => this.reset());
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

	async setUserActive(eventId: string, user: TeamUser, active: boolean) {
		try {
			await setDoc(doc(db, 'events', eventId, 'activeUsers', user.id), {
				active,
				team: user.team,
				user_name: user.name,
				user_type: user.type,
				updated_by: userStore.user?.uid,
				updated_at: serverTimestamp(),
			}, {merge: true});
		} catch (e) {
			showSnackbar(`Failed to update event user: ${e}`);
		}
	}

	get activeUserIds() {
		return Object.values(this.activeUsers)
			.filter(user => user.active)
			.map(user => user.id);
	}

	get isCurrentUserActive() {
		const userId = userStore.user?.uid;
		return !!userId && this.activeUsers[userId]?.active === true;
	}
}

const eventActiveUsersStore = new EventActiveUsersStore();
export default eventActiveUsersStore;
