import {observer} from "mobx-react-lite";
import {Stack, useGlobalSearchParams} from "expo-router";
import {useEffect, useMemo} from "react";
import {StackWrapper} from "@ninjas-strategy/ui";
import {MD2Colors} from "react-native-paper";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import eventsStore from "@/lib/stores/eventsStore";

export default observer(function EventLayout() {
	const {eventId, id} = useGlobalSearchParams();
	const {events} = eventsStore;
	const event = events[eventId as string];
	const eventStore = useMemo(() => new EventStore(eventId as string), []);
	const {subscribe, unsubscribe} = eventStore;

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, []);

	return (
		<EventContext.Provider value={eventStore}>
			<StackWrapper>
				<Stack
					screenOptions={{
						// headerTitleAlign: 'left',
						headerStyle: {backgroundColor: MD2Colors.indigo900},
						headerTitleStyle: {
							color: MD2Colors.white
						},
						headerBackButtonDisplayMode: 'minimal',
						contentStyle: {backgroundColor: 'transparent'},
						headerBlurEffect: 'light',
					}}>
					<Stack.Screen name="index" options={{title: `${event?.name} (${event?.id})`}}/>
					<Stack.Screen
						name="detailed/[id]"
						options={{
							headerTitle: `Team ${id} Games`,
						}}
					/>
				</Stack>
			</StackWrapper>
		</EventContext.Provider>
	);
});
