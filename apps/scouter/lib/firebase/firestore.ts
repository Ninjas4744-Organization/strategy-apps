import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import app from "./";
import {
	FIRESTORE_EMULATOR_PORT,
	getFirebaseEmulatorHost,
	shouldUseFirebaseEmulator,
} from "@/lib/firebase/emulator";

export const db = getFirestore(app);

const emulatorState = globalThis as typeof globalThis & {
	__NINJAS_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
};

if (shouldUseFirebaseEmulator && !emulatorState.__NINJAS_FIRESTORE_EMULATOR_CONNECTED__) {
	connectFirestoreEmulator(db, getFirebaseEmulatorHost(), FIRESTORE_EMULATOR_PORT);
	emulatorState.__NINJAS_FIRESTORE_EMULATOR_CONNECTED__ = true;
}
