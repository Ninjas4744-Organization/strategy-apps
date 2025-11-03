import styled from "styled-components/native";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {Subtitle, Title, Icon, Loading, HeaderButtons} from "@ninjas-strategy/ui";
import {TeamItem} from "@/lib/components/admin/TeamItem";
import {ScrollView, View} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useGlobalSearchParams} from "expo-router";
import {MD2Colors} from "react-native-paper";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import {useTBA} from "@/lib/hooks/tba";
import adminStore from "@/lib/stores/adminStore";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default observer(function AdminIndex() {
	const {isLoading, loadTeams, teamsRanked, totalGamesCount, eventId} = useContext(EventContext) as EventStore;
	const {events} = adminStore;
	const event = events[eventId];

	if (isLoading)
		return <Loading />;

	const [topTeam] = teamsRanked;

	return <>
			<ScrollView>
				<Stack.Screen options={{title: event.name, headerRight: () => <HeaderButtons buttons={[{icon: 'refresh', onPress: () => loadTeams()}]} />}}/>
				<SectionTitle
					title="Team Analytics Dashboard"
					subtitle={`${teamsRanked.length} teams analyzed • ${totalGamesCount} total games`} />
				<IconsRow>
					<StatCard>
						<StatIcon name="emoji-events" color={MD2Colors.amber500}/>
						<Title>{topTeam.teamNumber}</Title>
						<Subtitle>Top Team</Subtitle>
					</StatCard>
					<StatCard>
						<StatIcon name="trending-up" color={MD2Colors.green500}/>
						<Title>{topTeam.averageTotalScore.toFixed(2)}</Title>
						<Subtitle>Avg Score</Subtitle>
					</StatCard>
					<StatCard>
						<StatIcon name="sports-esports" color={MD2Colors.blue500}/>
						<Title>{totalGamesCount}</Title>
						<Subtitle>Total Games</Subtitle>
					</StatCard>
				</IconsRow>
				<View style={{margin: 8}}>
					<Title>Team Rankings</Title>
				</View>
				{teamsRanked.map((team, index) => <TeamItem
					key={team.teamNumber}
					{...team}
					averageTotalScore={team.averageTotalScore.toFixed(2)}
					index={index}/>)}
			</ScrollView>
		</>;
});


const StatCard = styled.View`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 8px;
	padding: 10px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	align-items: center;
`;

const StatIcon = styled(Icon)<{color: string}>`
	font-size: 20px;
	color: ${props => props.color};
`;
