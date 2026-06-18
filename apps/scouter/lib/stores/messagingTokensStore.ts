import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {Platform} from "react-native";
import {showSnackbar} from "@ninjas-strategy/ui";
import {db} from "@/lib/firebase/firestore";
import userStore from "@/lib/stores/userStore";
import {MessagingTokenPlatform} from "@/lib/models/MessagingToken";

const sanitizeTokenId = (token: string) => token.replace(/[^A-Za-z0-9_-]/g, '_');

class MessagingTokensStore {
	async saveCurrentUserToken(token: string, appVersion: string | null = null) {
		if (!userStore.user) {
			return;
		}

		const platform = Platform.OS as MessagingTokenPlatform;
		const tokenId = sanitizeTokenId(token);

		try {
			await setDoc(doc(db, 'users', userStore.user.uid, 'messagingTokens', tokenId), {
				token,
				platform,
				app_version: appVersion,
				created_at: serverTimestamp(),
				updated_at: serverTimestamp(),
				disabled_at: null,
			}, {merge: true});
		} catch (e) {
			showSnackbar(`Failed to save notification token: ${e}`);
		}
	}
}

const messagingTokensStore = new MessagingTokensStore();
export default messagingTokensStore;
