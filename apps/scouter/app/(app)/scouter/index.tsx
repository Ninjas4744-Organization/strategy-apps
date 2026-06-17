import {HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Href, Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {ScreenHeader} from "@/lib/components/ScreenHeader";


export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;

	if (isLoading)
		return <Loading/>;

	return (
		<>
			<Stack.Screen options={{headerShown: false}}/>
			<ScreenHeader
				title="Events"
				right={<HeaderButtons buttons={[{onPress: () => signOut().then(() => router.replace('/')), icon: 'logout'}]}/>} />
			<ScrollView>
				{events && Object.values(events).map((event) => (
					<EventItem key={event.id} onClick={() => router.push(`/scouter/${event.id}` as Href)} {...event} />
				))}
			</ScrollView>
		</>
	);
});
