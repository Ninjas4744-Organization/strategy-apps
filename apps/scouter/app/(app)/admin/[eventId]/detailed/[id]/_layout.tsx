import { Stack } from 'expo-router';
import {useThemeBundle} from "@ninjas-strategy/ui";

export default function Layout() {
	const {appTheme} = useThemeBundle();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {backgroundColor: appTheme.background},
			}}>
			<Stack.Screen name="(tabs)" />
		</Stack>
	);
}
