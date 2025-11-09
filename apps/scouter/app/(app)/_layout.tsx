import { Stack } from 'expo-router';
import {StackWrapper} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import userStore from "@/lib/stores/userStore";

export default observer(function AppLayout() {
	const {subscribe, unsubscribe, user} = userStore;

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, [user]);

	return <StackWrapper>
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {backgroundColor: 'transparent'},
				gestureEnabled: false,
			}}
		/>
	</StackWrapper>;
});
