import {observer} from "mobx-react-lite";
import {Redirect, Stack, useGlobalSearchParams} from "expo-router";
import {useEffect, useMemo} from "react";
import {Loading, StackWrapper, useThemeBundle} from "@ninjas-strategy/ui";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import eventsStore from "@/lib/stores/eventsStore";

export default observer(function EventLayout() {
	const {eventId, id} = useGlobalSearchParams();
	const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;
	const {events, isLoading: areEventsLoading} = eventsStore;
	const event = eventIdString ? events[eventIdString] : undefined;
	const eventStore = useMemo(() => new EventStore(eventIdString ?? ''), [eventIdString]);
	const {subscribe, unsubscribe} = eventStore;
	const {appTheme} = useThemeBundle();

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, [eventStore, event?.id]);

	if (!eventIdString || eventIdString === 'undefined') {
		return <Redirect href="/(app)/admin" />;
	}

	if (!event && !areEventsLoading) {
		return <Redirect href="/(app)/admin" />;
	}

	if (!event) {
		return <Loading />;
	}

	return (
		<EventContext.Provider value={eventStore}>
			<StackWrapper>
				<Stack
					screenOptions={{
						// headerTitleAlign: 'left',
						headerStyle: {backgroundColor: appTheme.surface},
						headerTitleStyle: {
							color: appTheme.text
						},
						headerTintColor: appTheme.text,
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
