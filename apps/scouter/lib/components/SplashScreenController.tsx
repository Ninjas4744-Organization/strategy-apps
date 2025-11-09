import {SplashScreen} from 'expo-router';
import {observer} from "mobx-react-lite";
import userStore from "@/lib/stores/userStore";

SplashScreen.preventAutoHideAsync();

export const SplashScreenController = observer(function () {
	const { isLoading } = userStore;

	if (!isLoading) {
		SplashScreen.hide();
	}

	return null;
});
