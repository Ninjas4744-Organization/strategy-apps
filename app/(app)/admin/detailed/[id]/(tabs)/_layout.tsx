import {Tabs, useLocalSearchParams} from 'expo-router';
import {Icon} from "@/components/Icon";
import {MD2Colors} from "react-native-paper";

export default function TabLayout() {
	const {id} = useLocalSearchParams();
	return (
		<Tabs
			safeAreaInsets={{ top: 0 }}
			screenOptions={{
				tabBarActiveTintColor: MD2Colors.white,
				headerShown: false,
				title: `Team ${id} Games`,
				sceneStyle: {backgroundColor: 'transparent'},
				tabBarPosition: 'top',
				tabBarStyle: {backgroundColor: MD2Colors.indigo900, paddingTop: 0},
				tabBarActiveBackgroundColor: MD2Colors.white + '20',
				tabBarVariant: 'uikit'
			}}>
			<Tabs.Screen
				name="games"
				options={{
					title: 'Games',
					tabBarIcon: ({ color }) => <Icon name="list"/>,
				}}
			/>
			<Tabs.Screen
				name="summary"
				options={{
					title: 'Summary',
					tabBarIcon: ({ color }) => <Icon name="analytics"/>,
				}}
			/>
		</Tabs>
	);
}
