import {getReactNativePersistence, initializeAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInAnonymously} from "firebase/auth";
import type {Auth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./";

let auth: Auth;

try {
	auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (e) {
	auth = getAuth(app);
}

export {auth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously};
