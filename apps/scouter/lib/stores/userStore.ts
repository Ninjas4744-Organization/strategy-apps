import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut} from "../firebase/auth";
import {User, UserCredential} from "firebase/auth";
import {Router} from "expo-router";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";

class UserStore {
	@observable user: User | null = null;
	@observable isLoading: boolean = true;

	@observable userData: UserData | null = null;
	userDataUnsubscribe: (() => void) | null = null;

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
	async signOut(): Promise<void> {
		await fbSignOut(auth);
	}

	@computed
	get isConnected(): boolean {
		return !!this.user;
	}

	@action.bound
	subscribe() {
		if (this.userDataUnsubscribe) {
			this.userDataUnsubscribe();
		}

		if (!this.user) {
			return;
		}

		const userRef = doc(db, 'users', this.user.uid);

		this.isLoading = true;
		this.userDataUnsubscribe = onSnapshot(userRef, snapshot => {
			runInAction(() => {
				if (snapshot.exists()) {
					this.userData = snapshot.data() as UserData;
				} else {
					this.userData = null;
				}
				this.isLoading = false;
			})
		});
	}

	@action.bound
	unsubscribe() {
		if (this.userDataUnsubscribe) {
			this.userDataUnsubscribe();
			this.userDataUnsubscribe = null;
		}
	}

	@action.bound
	goToBaseRoute(router: Router, email?: string | null) {
		if (!email) {
			if (!this.user) {
				return;
			}
			email = this.user.email;
		}
		if (email === 'admin@gmail.com')
			return router.push('/admin');
		router.push('/game/autonomous');
	}
}

const userStore = new UserStore();
export default userStore;
