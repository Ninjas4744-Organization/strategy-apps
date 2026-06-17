import {Redirect} from "expo-router";
import {observer} from "mobx-react-lite";
import userStore from "@/lib/stores/userStore";
import {Loading} from "@ninjas-strategy/ui";

export default observer(function AppIndex() {
	const {user, userData, isAdmin, isLoading, isProfileLoading} = userStore;

	if (isLoading || isProfileLoading) {
		return <Loading />;
	}

	if (!user) {
		return <Redirect href="/" />;
	}

	if (user.isAnonymous) {
		return <Redirect href="/(app)/demo" />;
	}

	if (!userData) {
		return <Loading />;
	}

	if (isAdmin) {
		return <Redirect href="/(app)/admin" />;
	}

	return <Redirect href="/(app)/scouter" />;
});
