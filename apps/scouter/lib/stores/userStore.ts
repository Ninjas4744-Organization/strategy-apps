import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously, signOut as fbSignOut, deleteUser} from "../firebase/auth";
import {User, UserCredential} from "firebase/auth";
import {doc, DocumentData, DocumentSnapshot, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserData} from "@/lib/interfaces/UserData";
import {UserType} from "@/lib/interfaces/UserType";
import {Subscription} from "rxjs";
import {observeDoc} from "@/lib/utilities";

class UserStore {
	user: User | null = null;
	isLoading: boolean = true;
	isProfileLoading: boolean = false;

	userData: UserData | null = null;
	private subscription: Subscription | null = null;
	private subscribedUserId: string | null = null;

	constructor() {
		makeObservable(this, {
			user: observable.ref,
			isLoading: observable,
			isProfileLoading: observable,
			userData: observable.ref,
			listenToAuthChanges: action.bound,
			signUp: action.bound,
			signIn: action.bound,
			demoSignIn: action.bound,
			signOut: action.bound,
			isConnected: computed,
			subscribe: action.bound,
			unsubscribe: action.bound,
			applyUserProfile: action.bound,
			isAdmin: computed,
			isAppAdmin: computed,
		});
		this.listenToAuthChanges();
	}

	listenToAuthChanges() {
		onAuthStateChanged(auth, (u) => {
			runInAction(() => {
				if (this.user?.uid !== u?.uid) {
					this.unsubscribe();
					this.userData = null;
				}
				this.user = u;
				this.isLoading = false;
			});
		});
	}

	async signUp(email: string, password: string): Promise<UserCredential> {
		return await createUserWithEmailAndPassword(auth, email, password);
	}

	async signIn(email: string, password: string): Promise<void> {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		runInAction(() => {
			if (this.user?.uid !== credential.user.uid) {
				this.unsubscribe();
			}
			this.user = credential.user;
			this.isLoading = false;
		});
	}

	async demoSignIn(): Promise<void> {
		const credential = await signInAnonymously(auth);
		runInAction(() => {
			if (this.user?.uid !== credential.user.uid) {
				this.unsubscribe();
			}
			this.user = credential.user;
			this.isLoading = false;
		});
	}

	async signOut(): Promise<void> {
		if (this.user?.isAnonymous) {
			await deleteUser(this.user);
			runInAction(() => {
				this.unsubscribe();
				this.user = null;
			});
			return;
		}
		await fbSignOut(auth);
		runInAction(() => {
			this.unsubscribe();
			this.user = null;
		});
	}

	get isConnected(): boolean {
		return !!this.user;
	}

	subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (!this.user) {
			this.userData = null;
			this.isProfileLoading = false;
			this.subscribedUserId = null;
			return;
		}

		const userId = this.user.uid;
		this.subscribedUserId = userId;
		this.isProfileLoading = true;

		const userRef = doc(db, 'users', userId);

		getDoc(userRef)
			.then(user => runInAction(() => this.applyUserProfile(userId, user)))
			.catch(error => {
				console.error('Failed to load user profile', error);
				runInAction(() => {
					if (this.subscribedUserId !== userId) {
						return;
					}

					this.userData = null;
					this.isProfileLoading = false;
				});
			});

		const $user = observeDoc(userRef);

		this.subscription = $user.subscribe({
			next: user => {
				runInAction(() => this.applyUserProfile(userId, user))
			},
			error: error => {
				console.error('Failed to load user profile', error);
				runInAction(() => {
					if (this.subscribedUserId !== userId) {
						return;
					}

					this.userData = null;
					this.isProfileLoading = false;
				});
			},
		})
	}

	applyUserProfile(userId: string, user: DocumentSnapshot<DocumentData>) {
		if (this.subscribedUserId !== userId) {
			return;
		}

		if (user.exists()) {
			this.userData = user.data() as UserData;
		} else {
			this.userData = null;
		}
		this.isProfileLoading = false;
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
		this.subscribedUserId = null;
		this.userData = null;
		this.isProfileLoading = false;
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
