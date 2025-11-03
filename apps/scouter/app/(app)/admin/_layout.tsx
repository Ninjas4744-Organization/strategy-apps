import {Stack} from 'expo-router';
import {observer} from "mobx-react-lite";
import adminStore from "@/lib/stores/adminStore";
import {Loading, StackWrapper} from "@ninjas-strategy/ui";
import {useEffect} from "react";
import {MD2Colors} from "react-native-paper";

export default observer(function AdminLayout() {
	const {isLoading, loadEvents, loaded} = adminStore;

	useEffect(() => {
		if (!loaded)
			loadEvents();
	}, []);

	if (isLoading)
		return <Loading />;

	return <StackWrapper>
		<Stack
			screenOptions={{
				headerStyle: {backgroundColor: MD2Colors.indigo900},
				headerTintColor: MD2Colors.white,
				contentStyle: {backgroundColor: 'transparent'},
			}}>
			<Stack.Screen name="[eventId]" options={{headerShown: false}} />
		</Stack>
	</StackWrapper>;
});
