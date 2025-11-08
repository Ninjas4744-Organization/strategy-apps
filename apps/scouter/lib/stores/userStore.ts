import { makeObservable, observable, action, runInAction } from "mobx";
import {auth, onAuthStateChanged, signOut as fbSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../firebase/auth";
import { User, UserCredential } from "firebase/auth";
import {Router} from "expo-router";

class UserStore {
	@observable user: User | null = null;
	@observable loading: boolean = true;

	constructor() {
		makeObservable(this);
		this.listenToAuthChanges();
	}

	@action.bound
	private listenToAuthChanges() {
		onAuthStateChanged(auth, (u) => {
			runInAction(() => {
				this.user = u;
				this.loading = false;
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

export const userStore = new UserStore();
