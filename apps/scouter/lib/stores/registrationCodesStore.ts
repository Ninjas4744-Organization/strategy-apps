import {action, makeObservable, observable, runInAction} from "mobx";
import {RegistrationCode} from "@/lib/models/RegistrationCode";
import userStore from "@/lib/stores/userStore";
import {collection, doc, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {UserType} from "@/lib/interfaces/UserType";
import {getRandomString, observeCollection} from "@/lib/utilities";
import {showSnackbar} from "@ninjas-strategy/ui";
import {type Subscription} from "rxjs";

type RegistrationCodes = {
	[teamNumber: string]: RegistrationCode;
};

class RegistrationCodesStore {
	isLoading: boolean = false;
	registrationCodes: RegistrationCodes = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			registrationCodes: observable.ref,
			subscribe: action.bound,
			unsubscribe: action.bound,
			generateRegistrationCode: action.bound,
		});
	}

	async subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (userStore.userData?.type !== UserType.APP_ADMIN)
			return;

		this.isLoading = true;

		const $registrationCodes = observeCollection(collection(db, 'registration_codes'));
		this.subscription = $registrationCodes.subscribe(registrationCodes => {
			runInAction(() => {
				const nextRegistrationCodes: RegistrationCodes = {};
				for (const registrationCodeDoc of registrationCodes) {
					const registrationCodeData = registrationCodeDoc.data();
					const registrationCode = RegistrationCode.fromMap(registrationCodeDoc.id, registrationCodeData);
					nextRegistrationCodes[registrationCode.id] = registrationCode;
				}
				this.registrationCodes = nextRegistrationCodes;
				this.isLoading = false;
			})
		});
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
	}

	async generateRegistrationCode(team: number) {
		try {
			const registrationCodesRef = doc(db, 'registration_codes', team.toString());

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
