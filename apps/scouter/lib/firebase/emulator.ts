import {Platform} from "react-native";

export const shouldUseFirebaseEmulator =
	process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === "true";

export const getFirebaseEmulatorHost = () => {
	if (process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST) {
		return process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
	}

	return Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
};

export const FIRESTORE_EMULATOR_PORT = Number(
	process.env.EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT || 4744,
);

export const AUTH_EMULATOR_PORT = Number(
	process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || 9099,
);
