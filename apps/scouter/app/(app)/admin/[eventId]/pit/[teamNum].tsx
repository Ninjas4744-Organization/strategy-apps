import {useEffect} from "react";
import {Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import {games} from "@ninjas-strategy/frc-games";
import {BeautifulButton, BodyScroll, BottomSafeArea, Loading, Title, CardSurface} from "@ninjas-strategy/ui";
import {PitForm} from "@ninjas-strategy/ui/pit_form";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import styled from "styled-components/native";
import eventsStore from "@/lib/stores/eventsStore";
import pitStore from "@/lib/stores/pitStore";

const MessageCard = styled(CardSurface)`
	margin: 16px;
	padding: 20px;
`;

export default observer(function AdminPitReportScreen() {
	const router = useRouter();
	const {eventId: eventIdParam, teamNum: teamNumParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const teamNum = Array.isArray(teamNumParam) ? teamNumParam[0] : teamNumParam;
	const event = eventId ? eventsStore.events[eventId] : undefined;
	const game = event ? games[event.year] : undefined;
	const {data, updateValue, isLoading} = pitStore;

	useEffect(() => {
		if (!eventId || !teamNum || !event)
			return;

		pitStore.loadFromFirebase(teamNum, eventId, event.year);
	}, [eventId, event, teamNum]);

	if (!eventId || !teamNum || !event || !game) {
		return <>
			<Stack.Screen options={{title: `Team ${teamNum ?? ''} Pit`}} />
			<MessageCard>
				<Title>Team or event unavailable</Title>
			</MessageCard>
		</>;
	}

	if (isLoading) {
		return <>
			<Stack.Screen options={{title: `Team ${teamNum} Pit`}} />
			<Loading />
		</>;
	}

	if (!game.pitScoutingAttributes) {
		return <>
			<Stack.Screen options={{title: `Team ${teamNum} Pit`}} />
			<MessageCard>
				<Title>No pit scouting form is configured for this game.</Title>
			</MessageCard>
		</>;
	}

	return <KeyboardAwareScrollView ScrollViewComponent={BodyScroll} bottomOffset={60}>
		<Stack.Screen options={{title: `Team ${teamNum} Pit`}} />
		<PitForm {...game} data={data} setData={updateValue} />
		<BottomSafeArea>
			<BeautifulButton
				label="Save pit report"
				icon="cloud-upload"
				onPress={() => pitStore.submitToFirebase(teamNum, eventId).then(sent => sent && router.back())} />
		</BottomSafeArea>
	</KeyboardAwareScrollView>;
});
