import {observer} from "mobx-react-lite";
import {useGlobalSearchParams, useRouter} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";
import {BeautifulButton, BodyScroll, BottomSafeArea} from "@ninjas-strategy/ui";
import {games} from "@ninjas-strategy/frc-games";
import {PitForm} from "@ninjas-strategy/ui/pit_form";
import pitStore from "@/lib/stores/pitStore";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default observer(function ScouterEvent() {
	const router = useRouter();
	const {eventId: eventIdParam, teamNum: teamNumParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const teamNum = Array.isArray(teamNumParam) ? teamNumParam[0] : teamNumParam;
	const event = eventId ? eventsStore.events[eventId] : undefined;
	const game = event ? games[event.year] : null;
	const {pitScoutingAttributes} = game || {};
	const {data, updateValue} = pitStore;

	if (!eventId || !teamNum || !event || !game || !pitScoutingAttributes) {
		return null;
	}

	return <KeyboardAwareScrollView ScrollViewComponent={BodyScroll} bottomOffset={60}>
		<PitForm {...game} data={data} setData={updateValue} />
		<BottomSafeArea>
			<BeautifulButton
				label="Submit to Firebase"
				icon="cloud-upload"
				onPress={() => pitStore.submitToFirebase(teamNum, eventId).then(() => router.push('/scouter'))} />
		</BottomSafeArea>
	</KeyboardAwareScrollView>;
});
