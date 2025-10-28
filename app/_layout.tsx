import {Stack} from 'expo-router';
import {AuthProvider, useAuth} from '@/lib/context/auth';
import {SplashScreenController} from '@/lib/components/splash';
import {StackWrapper} from "@/lib/components/styles/StackWrapper";
import {GlobalSnackbar} from "@/lib/components/GlobalSnackbar";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {OfflineQueue} from "@/lib/OfflineQueue";
import {StatusBar} from "expo-status-bar";
import {useTheme} from "@react-navigation/native";

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
	let {colors} = useTheme();

	colors.background = 'transparent';

	return <>
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
		<StatusBar style="light" />
	</>;
}
