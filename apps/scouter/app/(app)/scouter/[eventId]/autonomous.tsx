import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {useState} from "react";
import {Button, Dialog} from "react-native-paper";
import {Text as RNText} from "react-native";
import {useGlobalSearchParams, useRouter} from "expo-router";
import gameStore from "@/lib/stores/gameStore";
import {BodyScroll, GameForm} from "@ninjas-strategy/ui";
import {games} from "@ninjas-strategy/frc-games";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export default observer(function AutonomousPage() {
	const router = useRouter();
	const {data, updateValue} = gameStore;
	const [showAutoEndDialog, setShowAutoEndDialog] = useState(false);
	const {eventId} = useGlobalSearchParams();

	return <>
		<Container>
			<SectionTitle
				title="Autonomous Phase"
				subtitle="Full auto control"
				iconLeft="sports-esports"
				iconRight="arrow-forward"
				onLeftClick={() => setShowAutoEndDialog(true)}/>
			<BodyScroll>
				<GameForm {...games[2025]} phase="autonomous" data={data} setData={(key, value) => updateValue(key, value)} />
			</BodyScroll>
		</Container>
		<Dialog visible={showAutoEndDialog} onDismiss={() => setShowAutoEndDialog(false)}>
			<Dialog.Title>Teleop Switch</Dialog.Title>
			<Dialog.Content>
				<RNText>You're about to switch to teleop phase. There's no turning back!</RNText>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={() => setShowAutoEndDialog(false)}>Cancel</Button>
				<Button onPress={() => (setShowAutoEndDialog(false), router.push(`/scouter/${eventId}/teleop`))}>OK</Button>
			</Dialog.Actions>
		</Dialog>
	</>;
});

