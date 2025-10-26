import {Stack, useGlobalSearchParams} from 'expo-router';
import {StackWrapper} from "../../../components/styles/StackWrapper";
import {observer} from "mobx-react-lite";
import adminStore from "../../../stores/admin_store";
import {Loading} from "../../../components/Loading";
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
