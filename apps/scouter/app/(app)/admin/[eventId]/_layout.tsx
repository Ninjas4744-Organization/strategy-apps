import {observer} from "mobx-react-lite";
import {Stack, useGlobalSearchParams} from "expo-router";
import {useEffect, useMemo} from "react";
import {Loading, StackWrapper} from "@ninjas-strategy/ui";
import {MD2Colors} from "react-native-paper";
import {EventContext, EventStore} from "@/lib/stores/eventStore";

export default observer(function EventLayout() {
	const {eventId, id} = useGlobalSearchParams();
	const eventStore = useMemo(() => new EventStore(eventId as string), []);
	const {isLoading, loadTeams, loaded} = eventStore;

	useEffect(() => {
		if (!loaded)
			loadTeams();
	}, []);

	if (isLoading)
		return <Loading />;

	return (
		<EventContext.Provider value={eventStore}>
			<StackWrapper>
				<Stack
					screenOptions={{
						headerTitleAlign: 'left',
						headerStyle: {backgroundColor: MD2Colors.indigo900},
						headerTitleStyle: {
							color: MD2Colors.white
						},
						headerBackButtonDisplayMode: 'minimal',
						contentStyle: {backgroundColor: 'transparent'},
						headerBlurEffect: 'light',
					}}>
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
