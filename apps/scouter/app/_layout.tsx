import {Stack} from 'expo-router';
import {SplashScreenController} from '@/lib/components/SplashScreenController';
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {StatusBar} from "expo-status-bar";
import {showSnackbar, Snackbar, StackWrapper} from "@ninjas-strategy/ui";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import 'react-native-reanimated';
import {MD2Colors, PaperProvider} from "react-native-paper";
import userStore from "@/lib/stores/userStore";
import {UserType} from "@/lib/interfaces/UserType";
import {KeyboardProvider} from "react-native-keyboard-controller";
import * as Updates from 'expo-updates';
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient()

export default observer(function Root() {
	useEffect(() => {
		OfflineQueue.listenForConnectivityAndResend();
		checkUpdates();
	}, []);

	const checkUpdates = async () => {
		try {
			const update = await Updates.checkForUpdateAsync();
			if (update.isAvailable) {
				await Updates.fetchUpdateAsync();
				await Updates.reloadAsync();
			} else {
				const savedRuntimeVersion = await AsyncStorage.getItem('savedRuntimeVersion');
				if (savedRuntimeVersion !== Updates.runtimeVersion)
				{
					await AsyncStorage.setItem('savedRuntimeVersion', Updates.runtimeVersion ?? '');
					showSnackbar('App updated to version ' + Updates.runtimeVersion);
				}
			}
		} catch (e) {
			console.error('Error checking for updates:', e);
		}
	}

	return (
		<KeyboardProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider>
					<SplashScreenController/>
					<RootNavigator/>
					<Snackbar/>
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
