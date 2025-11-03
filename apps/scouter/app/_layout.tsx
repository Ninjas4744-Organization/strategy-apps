import {Stack} from 'expo-router';
import {AuthProvider, useAuth} from '@/lib/context/auth';
import {SplashScreenController} from '@/lib/components/SplashScreenController';
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {StatusBar} from "expo-status-bar";
import {Snackbar, StackWrapper} from "@ninjas-strategy/ui";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import 'react-native-reanimated';
import {PaperProvider} from "react-native-paper";

const queryClient = new QueryClient()

export default observer(function Root() {
	useEffect(() => {
		OfflineQueue.listenForConnectivityAndResend();
	}, []);

	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider>
					<SplashScreenController/>
					<RootNavigator/>
					<Snackbar/>
				</PaperProvider>
			</QueryClientProvider>
		</AuthProvider>
	);
});

function RootNavigator() {
	const {user} = useAuth();

	return (
		<>
			<StackWrapper>
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: {backgroundColor: 'transparent'}
				}}>
					<Stack.Screen name="index"/>
					<Stack.Screen name="registration/[teamNumber]" />
					<Stack.Protected guard={!!user}>
						<Stack.Screen name="(app)" options={{gestureEnabled: false}}/>
					</Stack.Protected>
				</Stack>
			</StackWrapper>
			<StatusBar style="light" />
		</>
	);
}
