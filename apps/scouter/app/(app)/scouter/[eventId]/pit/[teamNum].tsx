import {observer} from "mobx-react-lite";
import {useGlobalSearchParams, useRouter} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";
import {BeautifulButton, BodyScroll} from "@ninjas-strategy/ui";
import {games} from "@ninjas-strategy/frc-games";
import {PitForm} from "@ninjas-strategy/ui/pit_form";
import pitStore from "@/lib/stores/pitStore";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default observer(function ScouterEvent() {
	const router = useRouter();
	const {eventId, teamNum} = useGlobalSearchParams();
	const event = eventsStore.events[eventId as string];
	const game = event ? games[event?.year!] : null;
	const {pitScoutingAttributes} = game || {};
	const {data, updateValue} = pitStore;

	if (!event || !game || !pitScoutingAttributes) {
		return null;
	}

	return <KeyboardAwareScrollView ScrollViewComponent={BodyScroll} bottomOffset={60}>
		<PitForm {...game} data={data} setData={updateValue} />
		<BeautifulButton
			label="Submit to Firebase"
			icon="cloud-upload"
			onPress={() => pitStore.submitToFirebase(teamNum as string, eventId as string).then(() => router.push('/scouter'))} />
	</KeyboardAwareScrollView>;
});
