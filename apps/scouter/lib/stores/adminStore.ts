import {action, makeObservable, observable} from "mobx";
import {Event} from "@/lib/models/Event";
import {collection, doc, getDocs, serverTimestamp, setDoc, addDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {showSnackbar} from "@ninjas-strategy/ui";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {TBA} from "@/lib/hooks/tba";
import {Router} from "expo-router";
import {getRandomString} from "@/lib/utilities";
import {RegistrationCode} from "@/lib/models/RegistrationCode";

type Events = {
	[eventId: string]: Event;
};

type RegistrationCodes = {
	[teamNumber: string]: RegistrationCode;
};

class AdminStore {
	@observable loaded: boolean = false;
	@observable events: Events = {};
	@observable isLoading: boolean = true;

	@observable registrationCodesLoaded: boolean = false;
	@observable registrationCodes: RegistrationCodes = {};
	@observable registrationCodesLoading: boolean = false;

	@observable error?: string;

	constructor() {
		makeObservable(this);
	}

	@action.bound
	async loadEvents() {
		this.isLoading = true;
		this.events = {};
		try {
			const eventsRef = collection(db, 'events');
			const eventsSnapshot = await getDocs(eventsRef);
			for (const eventDoc of eventsSnapshot.docs) {
				const eventData = eventDoc.data();
				const event = Event.fromMap(eventDoc.id, eventData);
				this.events[event.id] = Event.fromMap(eventDoc.id, eventData)
			}
		} catch (e) {
			this.error = `Failed to load events: ${e}`;
		} finally {
			this.loaded = true;
			this.isLoading = false;
		}
	}

	@action.bound
	async loadRegistrationCodes() {
		this.registrationCodesLoading = true;
		this.registrationCodes = {};
		try {
			const registrationCodesRef = collection(db, 'registration_codes');
			const registrationCodesSnapshot = await getDocs(registrationCodesRef);
			for (const registrationCodeDoc of registrationCodesSnapshot.docs) {
				const registrationCodeData = registrationCodeDoc.data();
				const registrationCode = RegistrationCode.fromMap(registrationCodeDoc.id, registrationCodeData);
				this.registrationCodes[registrationCode.id] = RegistrationCode.fromMap(registrationCodeDoc.id, registrationCodeData)
			}
		} catch (e) {
			this.error = `Failed to load registration codes: ${e}`;
		} finally {
			this.registrationCodesLoaded = true;
			this.registrationCodesLoading = false;
		}
	}

	@action.bound
	async createEvent(eventData: TBAEventSimple, router: Router) {
		try {
			const teamsRes = await TBA(`/event/${eventData.key}/teams/keys`);
			const eventsRef = doc(db, 'events', eventData.key);
			await setDoc(eventsRef, {
				...eventData,
				teams: teamsRes.data,
			});
		} catch (e) {
			this.error = `Failed to create event: ${e}`;
		} finally {
			this.loadEvents();
			router.back();
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
			this.loadRegistrationCodes();
		} catch (e) {
			console.log(e);
			this.error = `Failed to create registration codes: ${e}`;
		}
	}
}

export default new AdminStore();
