import { Stack } from 'expo-router';

export default function AppLayout() {
	return <Stack
		screenOptions={{
			headerShown: false,
			contentStyle: {backgroundImage: 'linear-gradient(rgb(26, 35, 126), rgb(13, 71, 161), rgb(21, 101, 192))'}
		}}
	/>;
}
