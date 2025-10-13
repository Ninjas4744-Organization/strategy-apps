import { Stack } from 'expo-router';
import {StackWrapper} from "../../components/styles/StackWrapper";

export default function AppLayout() {
	return <StackWrapper>
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {backgroundColor: 'transparent'},
			}}
		/>
	</StackWrapper>;
}
