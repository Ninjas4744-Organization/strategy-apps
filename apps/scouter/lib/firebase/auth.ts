import type {Auth} from "firebase/auth";
import {
	getAuth,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./";

export let auth: Auth;

try {
	auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});
}
catch (e) {
	auth = getAuth(app);
}

export {
	onAuthStateChanged,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword, signInAnonymously,
	deleteUser,
} from 'firebase/auth';
