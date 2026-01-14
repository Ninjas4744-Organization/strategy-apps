import {Stack} from 'expo-router';
import {Header} from "@/lib/components/game/Header";
import {StackWrapper} from "@ninjas-strategy/ui";

export default function GameLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{
				header: ({route}) => <Header route={route} />,
				contentStyle: {backgroundColor: 'transparent'},
				headerBlurEffect: 'light',
				gestureEnabled: false
			}}
		/>
	</StackWrapper>;
}
