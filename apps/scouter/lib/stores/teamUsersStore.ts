import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection, query, where, DocumentData, QueryDocumentSnapshot} from "firebase/firestore";
import {type Subscription} from "rxjs";
import {showSnackbar} from "@ninjas-strategy/ui";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";
import {UserType} from "@/lib/interfaces/UserType";
import userStore from "@/lib/stores/userStore";
import {observeCollection} from "@/lib/utilities";

export type TeamUser = UserData & {
	id: string;
};

type TeamUsers = {
	[userId: string]: TeamUser;
};

class TeamUsersStore {
	isLoading: boolean = false;
	users: TeamUsers = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			users: observable.ref,
			subscribeForCurrentTeam: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyUsers: action.bound,
			scouters: computed,
			scouterOptions: computed,
		});
	}

	reset() {
		this.users = {};
		this.isLoading = false;
	}

	applyUsers(docs: QueryDocumentSnapshot<DocumentData>[]) {
		const nextUsers: TeamUsers = {};
		for (const userDoc of docs) {
			const data = userDoc.data() as UserData;
			nextUsers[userDoc.id] = {
				id: userDoc.id,
				...data,
			};
		}
		this.users = nextUsers;
		this.isLoading = false;
	}

	subscribeForCurrentTeam() {
		this.unsubscribe();

		const team = userStore.userData?.team;
		if (!team) {
			this.reset();
			return;
		}

		this.isLoading = true;
		const usersRef = query(
			collection(db, 'users'),
			where('team', '==', team),
		);

		this.subscription = observeCollection(usersRef).subscribe({
			next: users => {
				runInAction(() => this.applyUsers(users));
			},
			error: error => {
				showSnackbar(`Failed to load team users: ${error.message}`);
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

	get scouters() {
		return Object.values(this.users)
			.filter(user => user.type === UserType.SCOUTER)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	get scouterOptions() {
		return this.scouters.map(scouter => ({
			label: scouter.name,
			value: scouter.id,
		}));
	}
}

const teamUsersStore = new TeamUsersStore();
export default teamUsersStore;
