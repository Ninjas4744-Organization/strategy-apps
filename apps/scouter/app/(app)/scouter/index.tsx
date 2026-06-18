import {HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import {Href, Stack, useRouter} from "expo-router";
import styled from "styled-components/native";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {ScreenHeader} from "@/lib/components/ScreenHeader";
import {EventsList} from "@/lib/components/EventsList";
import eventReportAccessStore from "@/lib/stores/eventReportAccessStore";
import {useEffect, useMemo} from "react";


export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut, user} = userStore;
	const allEventsList = useMemo(() => Object.values(events).filter(event => event.id && event.id !== 'undefined'), [events]);
	const eventIds = useMemo(() => allEventsList.map(event => event.id), [allEventsList]);
	const eventsList = allEventsList.filter(event =>
		event.active !== false
		&& (user?.isAnonymous || eventReportAccessStore.canReport(event.id))
	);

	useEffect(() => {
		eventReportAccessStore.subscribeForEvents(eventIds);
		return () => eventReportAccessStore.unsubscribe();
	}, [eventIds, user?.uid, user?.isAnonymous]);

	if (isLoading || eventReportAccessStore.isLoading)
		return <Loading/>;

	return (
		<Container>
			<Stack.Screen options={{headerShown: false}}/>
			<ScreenHeader
				title="Events"
				right={<HeaderButtons buttons={[{onPress: () => signOut().then(() => router.replace('/')), icon: 'logout'}]}/>} />
			<EventsList
				events={eventsList}
				onSelect={id => {
					if (!id || id === 'undefined') return;
					router.push(`/scouter/${id}` as Href);
				}} />
		</Container>
	);
});

const Container = styled.View`
	flex: 1;
	background-color: transparent;
`;
