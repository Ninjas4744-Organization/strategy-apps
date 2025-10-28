import {Stack} from 'expo-router';
import {AuthProvider, useAuth} from '@/lib/context/auth';
import {SplashScreenController} from '@/lib/components/splash';
import {StackWrapper} from "@/lib/components/styles/StackWrapper";
import {GlobalSnackbar} from "@/lib/components/GlobalSnackbar";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";

export default observer(function Root() {
	useEffect(() => {
		OfflineQueue.listenForConnectivityAndResend();
	}, []);

	return (
		<AuthProvider>
			<SplashScreenController/>
			<RootNavigator/>
			<GlobalSnackbar/>
		</AuthProvider>
	);
});

function RootNavigator() {
	const {user} = useAuth();

	return (
		<StackWrapper>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {backgroundColor: 'transparent'}
				}}>
				<Stack.Screen name="index"/>
				<Stack.Protected guard={!!user}>
					<Stack.Screen name="(app)" options={{gestureEnabled: false}}/>
				</Stack.Protected>
			</Stack>
		</StackWrapper>
	);
}
