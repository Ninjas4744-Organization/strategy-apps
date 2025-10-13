import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "../../../components/game/SectionTitle";
import {useState} from "react";
import {Button, Dialog} from "react-native-paper";
import {Text as RNText} from "react-native";
import {useRouter} from "expo-router";

const Container = styled.SafeAreaView`
	padding: 12px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

export default observer(function AutonomousPage() {
	const router = useRouter();
	const [showAutoEndDialog, setShowAutoEndDialog] = useState(false);

	return <>
		<Container>
			<SectionTitle
				title="Autonomous Phase"
				subtitle="Full auto control"
				iconLeft="sports-esports"
				iconRight="arrow-forward"
				onLeftClick={() => setShowAutoEndDialog(true)}/>
		</Container>
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
});

