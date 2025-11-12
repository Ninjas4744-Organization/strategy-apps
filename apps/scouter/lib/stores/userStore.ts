import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut} from "../firebase/auth";
import {User, UserCredential} from "firebase/auth";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";
import {UserType} from "@/lib/interfaces/UserType";

class UserStore {
	@observable user: User | null = null;
	@observable isLoading: boolean = true;

	@observable userData: UserData | null = null;
	private _unsubscribe: (() => void) | null = null;

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
		if (this._unsubscribe) {
			this._unsubscribe();
		}

		if (!this.user) {
			return;
		}

		const userRef = doc(db, 'users', this.user.uid);

		this.isLoading = true;
		this._unsubscribe = onSnapshot(userRef, snapshot => {
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
		if (this._unsubscribe) {
			this._unsubscribe();
			this._unsubscribe = null;
		}
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
