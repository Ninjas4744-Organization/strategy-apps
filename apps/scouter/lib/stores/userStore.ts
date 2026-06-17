import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously, signOut as fbSignOut, deleteUser} from "../firebase/auth";
import {User, UserCredential} from "firebase/auth";
import {doc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";
import {UserType} from "@/lib/interfaces/UserType";
import {Subscription} from "rxjs";
import {observeDoc} from "@/lib/utilities";

class UserStore {
	user: User | null = null;
	isLoading: boolean = true;

	userData: UserData | null = null;
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this, {
			user: observable.ref,
			isLoading: observable,
			userData: observable.ref,
			listenToAuthChanges: action.bound,
			signUp: action.bound,
			signIn: action.bound,
			demoSignIn: action.bound,
			signOut: action.bound,
			isConnected: computed,
			subscribe: action.bound,
			unsubscribe: action.bound,
			isAdmin: computed,
			isAppAdmin: computed,
		});
		this.listenToAuthChanges();
	}

	listenToAuthChanges() {
		onAuthStateChanged(auth, (u) => {
			runInAction(() => {
				this.user = u;
				this.isLoading = false;
			});
		});
	}

	async signUp(email: string, password: string): Promise<UserCredential> {
		return await createUserWithEmailAndPassword(auth, email, password);
	}

	async signIn(email: string, password: string): Promise<void> {
		await signInWithEmailAndPassword(auth, email, password);
	}

	async demoSignIn(): Promise<void> {
		await signInAnonymously(auth);
	}

	async signOut(): Promise<void> {
		if (this.user?.isAnonymous) {
			await deleteUser(this.user);
		}
		await fbSignOut(auth);
	}

	get isConnected(): boolean {
		return !!this.user;
	}

	subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (!this.user) {
			return;
		}

		this.isLoading = true;

		const $user = observeDoc(doc(db, 'users', this.user.uid));

		this.subscription = $user.subscribe(user => {
			runInAction(() => {
				if (user.exists()) {
					this.userData = user.data() as UserData;
				} else {
					this.userData = null;
				}
				this.isLoading = false;
			})
		})
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
	}

	get isAdmin() {
		if (!this.userData)
			return false;
		return this.userData.type !== UserType.SCOUTER;
	}

	get isAppAdmin() {
		if (!this.userData)
			return false;
		return this.userData.type === UserType.APP_ADMIN;
	}
}

const userStore = new UserStore();
export default userStore;
