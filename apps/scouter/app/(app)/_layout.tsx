import {Redirect, Stack} from 'expo-router';
import {StackWrapper} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import userStore from "@/lib/stores/userStore";

export default observer(function AppLayout() {
	const {subscribe, unsubscribe, user, isLoading} = userStore;

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, []);

	if (isLoading) {
		return null;
	}

	if (!user) {
		return <Redirect href="/" />;
	}

	return (
		<StackWrapper>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {backgroundColor: 'transparent'},
					gestureEnabled: false,
				}}>
				<Stack.Screen name="index" />
				<Stack.Screen name="admin" />
				<Stack.Screen name="scouter" />
			</Stack>
		</StackWrapper>
	);
});
