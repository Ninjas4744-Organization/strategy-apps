import {FormDialog, HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {useState} from "react";
import {Portal} from "react-native-paper";
import gameStore from "@/lib/stores/gameStore";

type TeamInputFormData = {
	teamNumber: string;
	gameNumber: string;
};

export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;
	const [startGameEvent, setStartGameEvent] = useState<string|null>(null);
	const {startGame} = gameStore;

	if (isLoading)
		return <Loading />;

	const event = startGameEvent ? eventsStore.events[startGameEvent] : null;

	const onSubmit = (data: TeamInputFormData) => {
		startGame(data.teamNumber, data.gameNumber, event?.year!);
		setStartGameEvent(null);
		router.push(`/scouter/${startGameEvent}/0`);
	}

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
				<EventItem key={event.id} onClick={() => setStartGameEvent(event.id)} {...event} />
			))}
		</ScrollView>
			<Portal>
				<FormDialog<TeamInputFormData>
					visible={!!startGameEvent}
					onDismiss={() => setStartGameEvent(null)}
					title={`Scout a game - ${event?.name}`}
					onSubmit={onSubmit}
					fields={[
						{
							name: "teamNumber",
							label: "Team Number",
							type: 'team',
							rules: {required: true},
							teams: event?.teams || [],
						},
						{
							name: "gameNumber",
							label: 'Game Number',
							type: 'number',
							iconLeft: 'sports-esports',
							rules: {required: true},
						}
					]} />
			</Portal>
		</>
	);
});
