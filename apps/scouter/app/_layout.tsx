import {Stack} from 'expo-router';
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {StatusBar} from "expo-status-bar";
import {AppThemeProvider, Snackbar, StackWrapper, useThemeBundle} from "@ninjas-strategy/ui";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import 'react-native-reanimated';
import userStore from "@/lib/stores/userStore";
import {UserType} from "@/lib/interfaces/UserType";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {AppDialog} from "@ninjas-strategy/ui/components/AppDialog";
import {Updater} from "@/lib/components/Updater";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaProvider} from "react-native-safe-area-context";

if (!__DEV__) {
	SplashScreen.setOptions({
		duration: 1000,
		fade: true,
	});
}

const queryClient = new QueryClient()

export default observer(function Root() {
	const {appTheme} = useThemeBundle();

	useEffect(() => {
		OfflineQueue.listenForConnectivityAndResend();
	}, []);

	return (
		<SafeAreaProvider>
			<KeyboardProvider>
				<QueryClientProvider client={queryClient}>
					<AppThemeProvider theme={appTheme}>
						<RootNavigator/>
						<AppDialog/>
						<Snackbar/>
						{!__DEV__ && <Updater/>}
					</AppThemeProvider>
				</QueryClientProvider>
			</KeyboardProvider>
		</SafeAreaProvider>
	);
});

const RootNavigator = observer(function () {
	const {user} = userStore;
	const {appTheme, mode} = useThemeBundle();

	return (
		<>
			<StackWrapper>
				<Stack
					screenOptions={{
						headerStyle: {backgroundColor: appTheme.surface},
						headerTintColor: appTheme.text,
						headerTitleStyle: {color: appTheme.text},
						contentStyle: {
							backgroundColor: appTheme.background,
						},
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
			<StatusBar style={mode === "dark" ? "light" : "dark"} />
		</>
	);
});
