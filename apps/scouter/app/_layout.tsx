import {Stack} from 'expo-router';
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {StatusBar} from "expo-status-bar";
import {Snackbar, StackWrapper} from "@ninjas-strategy/ui";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import 'react-native-reanimated';
import {MD2Colors, PaperProvider} from "react-native-paper";
import userStore from "@/lib/stores/userStore";
import {UserType} from "@/lib/interfaces/UserType";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {AppDialog} from "@ninjas-strategy/ui/components/AppDialog";
import {Updater} from "@/lib/components/Updater";
import * as SplashScreen from 'expo-splash-screen';

if (!__DEV__) {
	SplashScreen.setOptions({
		duration: 1000,
		fade: true,
	});
}

const queryClient = new QueryClient()

export default observer(function Root() {
	useEffect(() => {
		OfflineQueue.listenForConnectivityAndResend();
	}, []);

	return (
		<KeyboardProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider>
					<RootNavigator/>
					<AppDialog/>
					<Snackbar/>
					{!__DEV__ && <Updater/>}
				</PaperProvider>
			</QueryClientProvider>
		</KeyboardProvider>
	);
});

const RootNavigator = observer(function () {
	const {user} = userStore;

	return (
		<>
			<StackWrapper>
				<Stack
					screenOptions={{
						headerStyle: {backgroundColor: MD2Colors.indigo900},
						headerTintColor: MD2Colors.white,
						contentStyle: {backgroundColor: 'transparent'},
					}}>
					<Stack.Protected guard={!user}>
						<Stack.Screen name="index" options={{headerShown: false}}/>
						<Stack.Screen name="register/enter-code" options={{headerTitle: 'Register', headerBackButtonDisplayMode: 'minimal'}}/>
						<Stack.Screen
							name="register/details"
							options={({route}) => ({
								headerTitle: `Register as ${(route.params as Record<string, any>).userType === UserType.SCOUTER ? 'scout' : 'admin'} for team ${(route.params as Record<string, any>).teamNumber}`,
							})}/>
					</Stack.Protected>
					<Stack.Protected guard={!!user}>
						<Stack.Screen name="(app)" options={{gestureEnabled: false, headerShown: false}}/>
					</Stack.Protected>
				</Stack>
			</StackWrapper>
			<StatusBar style="light" />
		</>
	);
});
