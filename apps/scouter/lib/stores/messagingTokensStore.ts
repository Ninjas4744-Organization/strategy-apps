import {deleteDoc, doc, serverTimestamp, setDoc} from "firebase/firestore";
import {Platform} from "react-native";
import {showSnackbar} from "@ninjas-strategy/ui";
import {db} from "@/lib/firebase/firestore";
import userStore from "@/lib/stores/userStore";
import {
	MessagingTokenPlatform,
	MessagingTokenProvider,
	MessagingTokenType,
} from "@/lib/models/MessagingToken";

const sanitizeTokenId = (token: string) => token.replace(/[^A-Za-z0-9_-]/g, '_');

class MessagingTokensStore {
	async saveCurrentUserToken(
		token: string,
		appVersion: string | null = null,
		tokenType: MessagingTokenType = 'unknown',
		provider: MessagingTokenProvider = tokenType === 'expo' ? 'expo' : 'native',
	) {
		if (!userStore.user) {
			return;
		}

		const platform = Platform.OS as MessagingTokenPlatform;
		const tokenId = sanitizeTokenId(token);

		try {
			await setDoc(doc(db, 'users', userStore.user.uid, 'messagingTokens', tokenId), {
				token,
				token_type: tokenType,
				provider,
				platform,
				user_type: userStore.userData?.type ?? null,
				team: userStore.userData?.team ?? null,
				app_version: appVersion,
				created_at: serverTimestamp(),
				updated_at: serverTimestamp(),
				disabled_at: null,
			}, {merge: true});
		} catch (e) {
			showSnackbar(`Failed to save notification token: ${e}`);
		}
	}

	async deleteCurrentUserToken(token: string) {
		if (!userStore.user) {
			return;
		}

		try {
			await deleteDoc(doc(db, 'users', userStore.user.uid, 'messagingTokens', sanitizeTokenId(token)));
		} catch (e) {
			console.warn("Could not unregister push notifications", e);
		}
	}
}

const messagingTokensStore = new MessagingTokensStore();
export default messagingTokensStore;
