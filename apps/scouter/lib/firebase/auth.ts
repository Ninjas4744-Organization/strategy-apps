import type {Auth} from "firebase/auth";
import {
	connectAuthEmulator,
	getAuth,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./";
import {Platform} from "react-native";
import {
	AUTH_EMULATOR_PORT,
	getFirebaseEmulatorHost,
	shouldUseFirebaseEmulator,
} from "@/lib/firebase/emulator";

export const auth: Auth =
	Platform.OS === "web"
		? getAuth(app)
		: initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		});

const emulatorState = globalThis as typeof globalThis & {
	__NINJAS_AUTH_EMULATOR_CONNECTED__?: boolean;
};

if (shouldUseFirebaseEmulator && !emulatorState.__NINJAS_AUTH_EMULATOR_CONNECTED__) {
	connectAuthEmulator(
		auth,
		`http://${getFirebaseEmulatorHost()}:${AUTH_EMULATOR_PORT}`,
		{disableWarnings: true},
	);
	emulatorState.__NINJAS_AUTH_EMULATOR_CONNECTED__ = true;
}

export {
	onAuthStateChanged,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword, signInAnonymously,
	deleteUser,
} from 'firebase/auth';
