import {Stack} from 'expo-router';
import {AuthProvider, useAuth} from '@/lib/context/auth';
import {SplashScreenController} from '@/components/splash';
import {StackWrapper} from "@/components/styles/StackWrapper";

export default function Root() {
	return (
		<AuthProvider>
			<SplashScreenController/>
			<RootNavigator/>
		</AuthProvider>
	);
}

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
					<Stack.Screen name="(app)"/>
				</Stack.Protected>
			</Stack>
		</StackWrapper>
	);
}
