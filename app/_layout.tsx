import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/context/auth';
import { SplashScreenController } from '../components/splash';

export default function Root() {
	return (
		<AuthProvider>
			<SplashScreenController />
			<RootNavigator />
		</AuthProvider>
	);
}

function RootNavigator() {
	return <Stack screenOptions={{
		headerShown: false,
		contentStyle: {backgroundImage: 'linear-gradient(rgb(26, 35, 126), rgb(13, 71, 161), rgb(21, 101, 192))'}
	}} />;
}
