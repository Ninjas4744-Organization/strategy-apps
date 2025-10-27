import styled from "styled-components/native";
import adminStore from "@/stores/adminStore";
import {SectionTitle} from "@/components/game/SectionTitle";
import {Subtitle, Title} from "@/components/styles/Text";
import {Icon} from "@/components/Icon";
import {TeamItem} from "@/components/admin/TeamItem";
import {ScrollView, View} from "react-native";
import {observer} from "mobx-react-lite";
import {Loading} from "@/components/Loading";
import {Stack} from "expo-router";
import {DashboardHeaderButtons} from "@/components/admin/DashboardHeaderButtons";
import {MD2Colors} from "react-native-paper";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default observer(function AdminIndex() {
	const {teamsRanked, isLoading, totalGamesCount} = adminStore;

	if (isLoading)
		return <Loading />;

	const [topTeam] = teamsRanked;

	return <ScrollView>
		<Stack.Screen options={{title: 'Admin Dashboard', headerRight: () => <DashboardHeaderButtons />}}/>
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
	</ScrollView>;
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
