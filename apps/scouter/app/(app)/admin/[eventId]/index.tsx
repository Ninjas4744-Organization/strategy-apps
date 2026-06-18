import styled from "styled-components/native";
import {PageTitle} from "@/lib/components/game/PageTitle";
import {BeautifulButton, Subtitle, Title, Icon, CardSurface, Switch, Row, FlexGrow} from "@ninjas-strategy/ui";
import {TeamItem} from "@/lib/components/admin/TeamItem";
import {ScrollView, View} from "react-native";
import {observer} from "mobx-react-lite";
import {appColors} from "@ninjas-strategy/ui";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import {TeamItemSkeleton} from "@/lib/components/admin/TeamItemSkeleton";
import {Loader} from "@/lib/components/Loader";
import {Href, useRouter} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";
import userStore from "@/lib/stores/userStore";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default observer(function AdminIndex() {
	const router = useRouter();
	const eventStore = useContext(EventContext) as EventStore;
	const {eventId, isLoading, teamsRanked, totalGamesCount} = eventStore;
	const event = eventsStore.events[eventId];
	const {isAppAdmin} = userStore;

	const [topTeam] = teamsRanked;

	return <>
		{teamsRanked.map((team, index) => <Loader key={'team-loader-' + index} subscribe={team.subscribe} unsubscribe={team.unsubscribe} />)}
		<ScrollView>
			{isLoading ? Array.from({length: 5}).map((_, i) => <TeamItemSkeleton key={i} />) : <>
				<BeautifulButton
					label="Assign scouters"
					icon="person-add"
					onPress={() => router.push(`/admin/${eventId}/assignments` as Href)} />
				{isAppAdmin && event ? (
					<EventStatusCard>
						<Row>
							<Icon name={event.active ? "lock-open" : "lock"} size={24} />
							<EventStatusCopy>
								<Title>{event.active ? "Reports Open" : "Reports Closed"}</Title>
								<Subtitle>{event.active ? "Scouters can add match and pit reports." : "Admins can still review stats, but new reports are blocked."}</Subtitle>
							</EventStatusCopy>
							<FlexGrow />
							<Switch
								value={event.active}
								onValueChange={active => eventsStore.setEventActive(eventId, active)} />
						</Row>
					</EventStatusCard>
				) : null}
				{teamsRanked.length > 0 ? <>
					<PageTitle
						title="Team Analytics Dashboard"
						subtitle={`${teamsRanked.length} teams analyzed • ${totalGamesCount} total games`}/>
					<IconsRow>
						<StatCard>
							<StatIcon name="emoji-events" color={appColors.amber500}/>
							<Title>{topTeam.teamNumber}</Title>
							<Subtitle>Top Team</Subtitle>
						</StatCard>
						<StatCard>
							<StatIcon name="trending-up" color={appColors.green500}/>
							<Title>{topTeam.averageTotalScore.toFixed(1)}</Title>
							<Subtitle>Avg Score</Subtitle>
						</StatCard>
						<StatCard>
							<StatIcon name="sports-esports" color={appColors.blue500}/>
							<Title>{totalGamesCount}</Title>
							<Subtitle>Total Games</Subtitle>
						</StatCard>
					</IconsRow>
					<View style={{margin: 8}}>
						<Title>Team Rankings</Title>
					</View>
					{teamsRanked.map((team, index) => (
						<TeamItem
							key={team.teamNumber}
							team={team}
							averageTotalScore={team.averageTotalScore.toFixed(1)}
							index={index}/>
					))}
				</> : <IconsRow>
					<StatCard>
						<StatIcon name="info" color={appColors.blue500} />
						<Title>There's no data here yet</Title>
						<Subtitle>Once we'll have scouting reports, the data will show up here</Subtitle>
					</StatCard>
				</IconsRow>}
			</>}
		</ScrollView>
	</>;
});


const StatCard = styled(CardSurface)`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 8px;
	padding: 10px;
	align-items: center;
`;

const StatIcon = styled(Icon)<{color: string}>`
	font-size: 20px;
	color: ${props => props.color};
`;

const EventStatusCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 14px;
`;

const EventStatusCopy = styled.View`
	flex: 1;
	gap: 4px;
`;
