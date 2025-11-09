import {action, makeObservable, observable, runInAction} from "mobx";
import {RegistrationCode} from "@/lib/models/RegistrationCode";
import userStore from "@/lib/stores/userStore";
import {collection, doc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserType} from "@/lib/interfaces/UserType";
import {getRandomString} from "@/lib/utilities";
import {showSnackbar} from "@ninjas-strategy/ui";

type RegistrationCodes = {
	[teamNumber: string]: RegistrationCode;
};

class RegistrationCodesStore {
	@observable isLoading: boolean = false;
	@observable registrationCodes: RegistrationCodes = {};
	private _unsubscribe: (() => void) | null = null;

	constructor() {
		makeObservable(this);
	}

	@action.bound
	async subscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
		}

		if (userStore.userData?.type !== UserType.APP_ADMIN)
			return;

		const registrationCodesRef = collection(db, 'registration_codes');

		this.isLoading = true;
		this._unsubscribe = onSnapshot(registrationCodesRef, snapshot => {
			runInAction(() => {
				for (const registrationCodeDoc of snapshot.docs) {
					const registrationCodeData = registrationCodeDoc.data();
					const registrationCode = RegistrationCode.fromMap(registrationCodeDoc.id, registrationCodeData);
					this.registrationCodes[registrationCode.id] = RegistrationCode.fromMap(registrationCodeDoc.id, registrationCodeData);
				}
				this.isLoading = false;
			})
		})
	}

	@action.bound
	unsubscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
			this._unsubscribe = null;
		}
	}

	@action.bound
	async generateRegistrationCode(team: string) {
		try {
			const registrationCodesRef = doc(db, 'registration_codes', team);

			const members_code = getRandomString(10, 'ninja-scout-');
			const admins_code = getRandomString(10, 'ninja-scout-');

			await setDoc(registrationCodesRef, {
				members_code,
				admins_code,
			});

			showSnackbar(`Registration codes for team ${team} generated successfully!`);
		} catch (e) {
			showSnackbar(`Failed to create registration codes: ${e}`);
		}
	}
}

const registrationCodesStore = new RegistrationCodesStore();
export default registrationCodesStore;
