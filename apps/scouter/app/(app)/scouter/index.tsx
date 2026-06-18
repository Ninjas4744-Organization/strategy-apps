import {Card, HeaderButtons, Icon, Loading, Subtitle, Title} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Href, Stack, useRouter} from "expo-router";
import styled from "styled-components/native";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {ScreenHeader} from "@/lib/components/ScreenHeader";


export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;
	const eventsList = Object.values(events).filter(event => event.id && event.id !== 'undefined');

	if (isLoading)
		return <Loading/>;

	return (
		<Container>
			<Stack.Screen options={{headerShown: false}}/>
			<ScreenHeader
				title="Events"
				right={<HeaderButtons buttons={[{onPress: () => signOut().then(() => router.replace('/')), icon: 'logout'}]}/>} />
			<EventsScroll>
				{eventsList.length === 0 ? (
					<EmptyState>
						<Icon name="event-busy" size={44} />
						<Title>No events available</Title>
						<Subtitle>Your team does not have any scouting events yet.</Subtitle>
					</EmptyState>
				) : eventsList.map((event) => (
					<EventItem
						key={event.id}
						onClick={() => {
							if (!event.id || event.id === 'undefined') return;
							router.push(`/scouter/${event.id}` as Href);
						}}
						{...event} />
				))}
			</EventsScroll>
		</Container>
	);
});

const Container = styled.View`
	flex: 1;
	background-color: transparent;
`;

const EventsScroll = styled(ScrollView).attrs({
	style: {flex: 1, backgroundColor: 'transparent'},
	contentContainerStyle: {flexGrow: 1},
})`
	flex: 1;
	background-color: transparent;
`;

const EmptyState = styled(Card)`
	justify-content: center;
	gap: 8px;
`;
