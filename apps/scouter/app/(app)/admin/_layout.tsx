import {Stack, useGlobalSearchParams} from 'expo-router';
import {StackWrapper} from "@ninjas-strategy/ui/styles/StackWrapper";
import {observer} from "mobx-react-lite";
import adminStore from "@/lib/stores/adminStore";
import {Loading} from "@ninjas-strategy/ui/Loading";
import {useEffect} from "react";
import {MD2Colors} from "react-native-paper";

export default observer(function AdminLayout() {
	const {isLoading, loadTeams, loaded} = adminStore;
	const {id} = useGlobalSearchParams();

	useEffect(() => {
		if (!loaded)
			loadTeams();
	}, []);

	if (isLoading)
		return <Loading />;

	return <StackWrapper>
		<Stack
			screenOptions={{
				headerTitleAlign: 'left',
				headerStyle: {backgroundColor: MD2Colors.indigo900},
				headerTitleStyle: {
					color: MD2Colors.white
				},
				headerBackButtonDisplayMode: 'minimal',
				contentStyle: {backgroundColor: 'transparent'},
				headerBlurEffect: 'light',
			}}>
			<Stack.Screen
				name="detailed/[id]"
				options={{
					headerTitle: `Team ${id} Games`, // או כל כותרת אחרת שתעדכן דינמית
				}}
			/>
		</Stack>
	</StackWrapper>;
});
