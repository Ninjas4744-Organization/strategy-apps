import {Stack} from 'expo-router';
import {Header} from "../../../components/game/Header";
import {StackWrapper} from "../../../components/styles/StackWrapper";
import {observer} from "mobx-react-lite";
import {DashboardHeaderButtons} from "../../../components/admin/DashboardHeaderButtons";

export default function AdminLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{headerTitleAlign: 'left'}}>
			<Stack.Screen
				name="index"
				options={{
					title: 'Admin Dashboard',
					contentStyle: {backgroundColor: 'transparent'},
					headerBlurEffect: 'light',
					headerStyle: {backgroundColor: '#1A237E'},
					headerTitleStyle: {
						color: '#fff'
					},
					headerRight: () => <DashboardHeaderButtons />
				}}/>
			<Stack.Screen name="team"/>
			<Stack.Screen name="team_analytics"/>
		</Stack>
	</StackWrapper>;
};
