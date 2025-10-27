import {Stack} from 'expo-router';
import {Header} from "@/components/game/Header";
import {StackWrapper} from "@/components/styles/StackWrapper";

export default function AppLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{
				header: () => <Header />,
				contentStyle: {backgroundColor: 'transparent'},
				headerBlurEffect: 'light',
			}}
		/>
	</StackWrapper>;
}
