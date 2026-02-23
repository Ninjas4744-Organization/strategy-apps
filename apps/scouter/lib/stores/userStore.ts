import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously, signOut as fbSignOut} from "../firebase/auth";
import {User, UserCredential} from "firebase/auth";
import {doc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";
import {UserType} from "@/lib/interfaces/UserType";
import {Subscription} from "rxjs";
import {observeDoc} from "@/lib/utilities";
import bleStore from "@/lib/stores/bleStore";

class UserStore {
	@observable user: User | null = null;
	@observable isLoading: boolean = true;

	@observable userData: UserData | null = null;
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this);
		this.listenToAuthChanges();
	}

	@action.bound
	private listenToAuthChanges() {
		onAuthStateChanged(auth, (u) => {
			runInAction(() => {
				this.user = u;
				this.isLoading = false;
				if (!u) {
					bleStore.clearId();
				}
			});
		});
	}

	@action.bound
	async signUp(email: string, password: string): Promise<UserCredential> {
		return await createUserWithEmailAndPassword(auth, email, password);
	}

	@action.bound
	async signIn(email: string, password: string): Promise<void> {
		await signInWithEmailAndPassword(auth, email, password);
	}

	@action.bound
	async demoSignIn(): Promise<void> {
		await signInAnonymously(auth);
	}

	@action.bound
	async signOut(): Promise<void> {
		await fbSignOut(auth);
	}

	@computed
	get isConnected(): boolean {
		return !!this.user;
	}

	@action.bound
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
					bleStore.setId(this.userData.type + '-' + this.user?.uid);
				} else {
					this.userData = null;
				}
				this.isLoading = false;
			})
		})
	}

	@action.bound
	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
	}

	@computed
	get isAdmin() {
		if (!this.userData)
			return false;
		return this.userData.type !== UserType.SCOUTER;
	}

	@computed
	get isAppAdmin() {
		if (!this.userData)
			return false;
		return this.userData.type === UserType.APP_ADMIN;
	}
}

const userStore = new UserStore();
export default userStore;
