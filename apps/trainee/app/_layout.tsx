import {Stack} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import {Snackbar, StackWrapper} from "@ninjas-strategy/ui";
import 'react-native-reanimated';

export default function Root() {
	return (
		<>
			<RootNavigator/>
			<Snackbar/>
		</>
	);
};

function RootNavigator() {

	return (
		<>
			<StackWrapper>
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: {backgroundColor: 'transparent'}
					}}>
					<Stack.Screen name="index"/>
				</Stack>
			</StackWrapper>
			<StatusBar style="light" />
		</>
	);
}
