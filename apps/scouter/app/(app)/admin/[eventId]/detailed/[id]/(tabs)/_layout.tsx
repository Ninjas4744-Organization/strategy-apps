import {Tabs, useLocalSearchParams} from 'expo-router';
import {Icon, useThemeBundle} from "@ninjas-strategy/ui";

export default function TabLayout() {
	const {id} = useLocalSearchParams();
	const {appTheme} = useThemeBundle();

	return (
		<Tabs
			safeAreaInsets={{ top: 0 }}
			screenOptions={{
				tabBarActiveTintColor: appTheme.text,
				tabBarInactiveTintColor: appTheme.textMuted,
				headerShown: false,
				title: `Team ${id} Games`,
				sceneStyle: {backgroundColor: 'transparent'},
				tabBarPosition: 'top',
				tabBarStyle: {backgroundColor: appTheme.surface, borderTopColor: appTheme.border, paddingTop: 0},
				tabBarActiveBackgroundColor: appTheme.inputBackground,
				tabBarVariant: 'uikit',
				freezeOnBlur: true,
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
