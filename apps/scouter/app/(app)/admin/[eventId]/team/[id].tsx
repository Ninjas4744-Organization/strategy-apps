import {Href, Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {StatItem} from "@/lib/components/admin/StatItem";
import {Title, Row, Icon, SimpleButton, CardSurface, BeautifulButton} from "@ninjas-strategy/ui";
import {useContext, useEffect} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import {games} from "@ninjas-strategy/frc-games";
import eventsStore from "@/lib/stores/eventsStore";
import {ScrollView} from "react-native";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled(CardSurface)`
	margin: 8px;
	padding: 16px 10px;
	display: flex;
	flex-direction: column;
`;

const HeaderButtons = styled(Row)`
	gap: 20px;
	margin: 0 10px;
`;

const MessageCard = styled(CardSurface)`
	margin: 16px;
	padding: 20px;
`;

export default observer(function () {
	const {eventId, id} = useGlobalSearchParams();
	const router = useRouter();
	const {teams, isLoading, error} = useContext(EventContext) as EventStore;
	const team = teams[Number.parseInt(id as string)];
	const bestGame = team?.games.length ? team.games.reduce((a, b) => a.totalScore > b.totalScore ? a : b) : undefined;
	const {events} = eventsStore;
	const event = events[eventId as string];
	const game = event ? games[event.year] : undefined;

	useEffect(() => {
		team?.subscribe();
		return () => team?.unsubscribe();
	}, [team]);

	if (!team || !event || !game) {
		return <Container>
			<Stack.Screen options={{title: `Team ${id}`}} />
			<MessageCard>
				<Title>{isLoading ? 'Loading team' : 'Team unavailable'}</Title>
				{!isLoading && <Title>{error ?? 'This team or event could not be loaded.'}</Title>}
			</MessageCard>
		</Container>;
	}

	return <Container>
		<Stack.Screen
			options={{
				title: `Team ${id}`,
				headerRight: () => (
					<HeaderButtons>
						<SimpleButton onPress={() => router.push(`/admin/${eventId}/analytics/${id}`)}>
							<Icon name="analytics"/>
						</SimpleButton>
						<SimpleButton onPress={() => router.push(`/admin/${eventId}/compare/${id}` as Href)}>
							<Icon name="compare-arrows"/>
						</SimpleButton>
					</HeaderButtons>
				),
			}}/>
		<ScrollView>
			<PageHeader>
				<Row>
					<Title>Team {id}</Title>
				</Row>
				<Row>
					<StatItem icon="sports-esports" value={team.games.length} title="Games"/>
					<StatItem icon="trending-up" value={team.averageTotalScore.toFixed(1)} title="Avg Score"/>
					<StatItem icon="emoji-events" value={bestGame?.totalScore ?? 0} title="Best Score"/>
					<StatItem icon="speed" value={(team.consistencyScore * 100).toFixed(1) + '%'} title="Consistency"/>
				</Row>
				<BeautifulButton label="Click here to view insights" icon="lightbulb" onPress={() => router.push(`/admin/${eventId}/breakdown/${id}` as Href)} />
			</PageHeader>
			{game.mainPageSections.map((section, index) => (
				<PageHeader key={`${id}-inside-${index}`}>
					<Row>
						<Title>{section.title}</Title>
					</Row>
					<Row>
						{section.cards.map((card, index) => (
							<StatItem
								key={`${id}-card-${index}`}
								icon={card.icon}
								value={card.val(team)}
								title={card.label}
								color={card.color}/>
						))}
					</Row>
				</PageHeader>
			))}
		</ScrollView>
	</Container>;
});
