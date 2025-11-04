import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {User} from 'firebase/auth';
import {auth, onAuthStateChanged, signOut as fbSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '../firebase/auth';

interface AuthContextValue {
	user: User | null;
	loading: boolean;
	signUp(email: string, password: string): Promise<void>;
	signIn(email: string, password: string): Promise<void>;
	signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const value = useMemo<AuthContextValue>(() => ({
		user,
		loading,
		async signUp(email, password) {
			await createUserWithEmailAndPassword(auth, email, password);
		},
		async signIn(email, password) {
			await signInWithEmailAndPassword(auth, email, password);
		},
		async signOut() {
			await fbSignOut(auth);
		}
	}), [user, loading]);


	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};
