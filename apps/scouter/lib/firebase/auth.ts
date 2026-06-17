import type {Auth} from "firebase/auth";
import {
	getAuth,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./";
import {Platform} from "react-native";

export const auth: Auth =
	Platform.OS === "web"
		? getAuth(app)
		: initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		});

export {
	onAuthStateChanged,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword, signInAnonymously,
	deleteUser,
} from 'firebase/auth';
