import {initializeApp, getApps} from "firebase/app";

const useFirebaseEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === "true";
const env = (value: string | undefined, fallback?: string) => value || fallback;

const firebaseConfig = {
	apiKey: env(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, useFirebaseEmulator ? "demo-key" : undefined),
	authDomain: env(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, useFirebaseEmulator ? "scouting-app-3e18a.firebaseapp.com" : undefined),
	projectId: env(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, useFirebaseEmulator ? "scouting-app-3e18a" : undefined),
	storageBucket: env(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, useFirebaseEmulator ? "scouting-app-3e18a.appspot.com" : undefined),
	messagingSenderId: env(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, useFirebaseEmulator ? "000000000000" : undefined),
	appId: env(process.env.EXPO_PUBLIC_FIREBASE_APP_ID, useFirebaseEmulator ? "1:000000000000:web:demo" : undefined),
	measurementId: env(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID)
};

let app = getApps()[0];
if (!app)
	app = initializeApp(firebaseConfig);

export default app;
