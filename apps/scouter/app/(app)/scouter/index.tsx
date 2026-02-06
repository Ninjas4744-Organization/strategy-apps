import {FormDialog, HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Href, Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {useState} from "react";
import {Portal} from "react-native-paper";
import gameStore from "@/lib/stores/gameStore";


export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;

	if (isLoading)
		return <Loading />;

	return (
		<>
			<ScrollView>
				<Stack.Screen
				options={{
					headerShown: true,
					title: 'Events',
					headerRight: () => (
						<HeaderButtons buttons={[{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'}]} />
					)}}/>
			{events && Object.values(events).map((event) => (
				<EventItem key={event.id} onClick={() => router.push(`/scouter/${event.id}` as Href)} {...event} />
			))}
		</ScrollView>
		</>
	);
});
