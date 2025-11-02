import { Stack } from 'expo-router';
import {StackWrapper} from "@ninjas-strategy/ui";

export default function AppLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {backgroundColor: 'transparent'},
				gestureEnabled: false,
			}}
		/>
	</StackWrapper>;
}
