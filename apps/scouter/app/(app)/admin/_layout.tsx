import {Stack, Redirect} from 'expo-router';
import {observer} from "mobx-react-lite";
import {Loading, StackWrapper, useThemeBundle} from "@ninjas-strategy/ui";
import {useEffect} from "react";
import eventsStore from "@/lib/stores/eventsStore";
import userStore from "@/lib/stores/userStore";

export default observer(function AdminLayout() {
	const {isLoading, subscribe, unsubscribe} = eventsStore;
	const {user, userData, isAdmin, isProfileLoading} = userStore;
	const {appTheme} = useThemeBundle();

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, [subscribe, unsubscribe, user?.uid, user?.isAnonymous, userData?.type, userData?.team]);

	if (!user?.isAnonymous) {
		if (isProfileLoading || !userData) {
			return <Loading/>;
		}

		if (!isAdmin) {
			return <Redirect href="/(app)/scouter" />;
		}
	}

	if (isLoading) {
		return <Loading/>;
	}

	return (
		<StackWrapper>
			<Stack
				screenOptions={{
					headerStyle: {backgroundColor: appTheme.surface},
					headerTintColor: appTheme.text,
					headerTitleStyle: {color: appTheme.text},
					contentStyle: {backgroundColor: 'transparent'},
				}}
			>
				<Stack.Screen name="[eventId]" options={{headerShown: false}} />
			</Stack>
		</StackWrapper>
	);
});
