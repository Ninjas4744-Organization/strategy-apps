import {Stack, Redirect} from 'expo-router';
import {observer} from "mobx-react-lite";
import {Loading, StackWrapper} from "@ninjas-strategy/ui";
import {useEffect} from "react";
import {MD2Colors} from "react-native-paper";
import eventsStore from "@/lib/stores/eventsStore";
import userStore from "@/lib/stores/userStore";

export default observer(function ScouterLayout() {
	const {isLoading, subscribe, unsubscribe} = eventsStore;
	const {user, isAdmin} = userStore;

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, [user?.uid]);

	if (isAdmin && !user?.isAnonymous) {
		return <Redirect href="/(app)/admin" />;
	}

	if (isLoading)
		return <Loading />;

	return (
		<StackWrapper>
			<Stack
				screenOptions={{
					headerStyle: {backgroundColor: MD2Colors.indigo900},
					headerTintColor: MD2Colors.white,
					contentStyle: {backgroundColor: 'transparent'},
				}}>
				<Stack.Screen name="[eventId]" options={{headerShown: false}} />
			</Stack>
		</StackWrapper>
	);
});
