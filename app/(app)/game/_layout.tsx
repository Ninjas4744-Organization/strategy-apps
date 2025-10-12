import {Stack, useRouter} from 'expo-router';
import {Header} from "../../../components/game/header";
import {useState} from "react";
import {Button, Dialog} from "react-native-paper";
import {Text as RNText} from "react-native";

export default function AppLayout() {
	const [showAutoEndDialog, setShowAutoEndDialog] = useState(false);
	const router = useRouter();

	return <>
		<Stack
			screenOptions={{
				header: ({route}) => <Header {...route} showAutoEndDialog={() => setShowAutoEndDialog(true)} />,
				headerTransparent: true,
				contentStyle: {backgroundImage: 'linear-gradient(rgb(26, 35, 126), rgb(13, 71, 161), rgb(21, 101, 192))'}
			}}
		/>
		<Dialog visible={showAutoEndDialog} onDismiss={() => setShowAutoEndDialog(false)}>
			<Dialog.Title>Teleop Switch</Dialog.Title>
			<Dialog.Content>
				<RNText>You're about to switch to teleop phase. There's no turning back!</RNText>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={() => setShowAutoEndDialog(false)}>Cancel</Button>
				<Button onPress={() => (setShowAutoEndDialog(false), router.push('/game/teleop'))}>OK</Button>
			</Dialog.Actions>
		</Dialog>
	</>;
}
