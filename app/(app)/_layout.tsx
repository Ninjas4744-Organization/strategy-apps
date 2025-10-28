import { Stack } from 'expo-router';
import {StackWrapper} from "@/lib/components/styles/StackWrapper";

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
