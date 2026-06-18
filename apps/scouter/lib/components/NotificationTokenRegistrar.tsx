import {useEffect} from "react";
import {Platform} from "react-native";
import {isRunningInExpoGo} from "expo";
import Constants from "expo-constants";
import {observer} from "mobx-react-lite";
import messagingTokensStore from "@/lib/stores/messagingTokensStore";
import userStore from "@/lib/stores/userStore";

const NOTIFICATION_CHANNEL_ID = "messages";
const isAndroidExpoGo = Platform.OS === "android" && isRunningInExpoGo();
const supportsNativeNotifications = Platform.OS !== "web" && !isAndroidExpoGo;
type NotificationsModule = typeof import("expo-notifications");

async function getNotifications() {
	if (!supportsNativeNotifications) {
		return null;
	}

	return await import("expo-notifications");
}

function getProjectId() {
	return (
		Constants.expoConfig?.extra?.eas?.projectId ??
		Constants.easConfig?.projectId ??
		null
	);
}

async function getExpoPushToken() {
	const Notifications = await getNotifications();

	if (!Notifications) {
		return null;
	}

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
			name: "Messages",
			importance: Notifications.AndroidImportance.DEFAULT,
			showBadge: true,
		});
	}

	const existingPermissions = await Notifications.getPermissionsAsync();
	let status = existingPermissions.status;

	if (status !== "granted") {
		const requestedPermissions = await Notifications.requestPermissionsAsync();
		status = requestedPermissions.status;
	}

	if (status !== "granted") {
		return null;
	}

	const projectId = getProjectId();

	if (!projectId) {
		return null;
	}

	const token = await Notifications.getExpoPushTokenAsync({ projectId });
	return token.data;
}

export const NotificationTokenRegistrar = observer(function NotificationTokenRegistrar() {
	const {user, userData, isProfileLoading} = userStore;
	const userType = userData?.type ?? null;
	const userTeam = userData?.team ?? null;

	useEffect(() => {
		let isMounted = true;
		let notifications: NotificationsModule | null = null;

		void getNotifications().then(nextNotifications => {
			if (!isMounted || !nextNotifications) {
				return;
			}

			notifications = nextNotifications;
			notifications.setNotificationHandler({
				handleNotification: async () => ({
					shouldShowBanner: true,
					shouldShowList: true,
					shouldPlaySound: true,
					shouldSetBadge: true,
				}),
			});
		});

		return () => {
			isMounted = false;
			notifications?.setNotificationHandler(null);
		};
	}, []);

	useEffect(() => {
		if (!user || user.isAnonymous || isProfileLoading || !userData) {
			return;
		}

		let cancelled = false;
		let registeredToken: string | null = null;

		if (!supportsNativeNotifications) {
			return;
		}

		void (async () => {
			try {
				const token = await getExpoPushToken();

				if (!token || cancelled) {
					return;
				}

				registeredToken = token;
				console.log('[NotificationTokenRegistrar] Saving Expo push token', {
					platform: Platform.OS,
					projectId: getProjectId(),
					userType,
					userTeam,
				});
				await messagingTokensStore.saveCurrentUserToken(
					token,
					Constants.expoConfig?.version ?? null,
					'expo',
					'expo',
				);
			} catch (error) {
				console.warn("Could not register push notifications", error);
			}
		})();

		return () => {
			cancelled = true;

			if (registeredToken) {
				void messagingTokensStore.deleteCurrentUserToken(registeredToken).catch((error) => {
					console.warn("Could not unregister push notifications", error);
				});
			}
		};
	}, [user?.uid, user?.isAnonymous, userType, userTeam, isProfileLoading]);

	return null;
});
