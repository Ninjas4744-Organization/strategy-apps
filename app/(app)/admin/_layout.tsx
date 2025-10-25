import {Stack, useLocalSearchParams} from 'expo-router';
import {Header} from "../../../components/game/Header";
import {StackWrapper} from "../../../components/styles/StackWrapper";
import {observer} from "mobx-react-lite";
import {DashboardHeaderButtons} from "../../../components/admin/DashboardHeaderButtons";
import adminStore from "../../../stores/admin_store";
import {Loading} from "../../../components/Loading";
import {useEffect} from "react";

export default observer(function AdminLayout() {
	const {isLoading, loadTeams, loaded} = adminStore;

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
				headerStyle: {backgroundColor: '#1A237E'},
				headerTitleStyle: {
					color: '#fff'
				},
				headerBackButtonDisplayMode: 'minimal',
				contentStyle: {backgroundColor: 'transparent'},
				headerBlurEffect: 'light',
			}}/>
	</StackWrapper>;
});
