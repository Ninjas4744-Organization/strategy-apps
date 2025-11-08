import {SplashScreen} from 'expo-router';
import {observer} from "mobx-react-lite";
import {userStore} from "@/lib/stores/userStore";

SplashScreen.preventAutoHideAsync();

export const SplashScreenController = observer(function () {
	const { loading } = userStore;

	if (!loading) {
		SplashScreen.hide();
	}

	return null;
});
