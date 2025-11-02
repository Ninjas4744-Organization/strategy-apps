import {Stack} from 'expo-router';
import {Header} from "@/lib/components/game/Header";
import {StackWrapper} from "@ninjas-strategy/ui";

export default function AppLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{
				header: () => <Header />,
				contentStyle: {backgroundColor: 'transparent'},
				headerBlurEffect: 'light',
				gestureEnabled: false
			}}
		/>
	</StackWrapper>;
}
