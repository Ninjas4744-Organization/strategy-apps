import styled from "styled-components/native";
import adminStore from "../../../stores/admin_store";
import {SectionTitle} from "../../../components/game/SectionTitle";
import {Subtitle, Title} from "../../../components/styles/Text";
import {Icon} from "../../../components/Icon";
import {Colors} from "../../../components/styles/colors";
import {TeamItem} from "../../../components/admin/TeamItem";
import {ScrollView, View} from "react-native";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default function AdminIndex() {
	const {teams} = adminStore;
	const gamesCount = teams.reduce((v, cur) => v + cur.games.length, 0);
	const [topTeam] = teams;

	return <ScrollView>
		<SectionTitle
			title="Team Analytics Dashboard"
			subtitle={`${teams.length} teams analyzed • ${gamesCount} total games`} />
		<IconsRow>
			<StatCard>
				<StatIcon name="emoji-events" color={Colors.amber}/>
				<Title>{topTeam.teamNumber}</Title>
				<Subtitle>Top Team</Subtitle>
			</StatCard>
			<StatCard>
				<StatIcon name="trending-up" color={Colors.green}/>
				<Title>{topTeam.averageTotalScore.toFixed(2)}</Title>
				<Subtitle>Avg Score</Subtitle>
			</StatCard>
			<StatCard>
				<StatIcon name="sports-esports" color={Colors.blue}/>
				<Title>{gamesCount}</Title>
				<Subtitle>Total Games</Subtitle>
			</StatCard>
		</IconsRow>
		<View style={{margin: 8}}>
			<Title>Team Rankings</Title>
		</View>
		{teams.map((team, index) => <TeamItem
			key={team.teamNumber}
			{...team}
			averageTotalScore={team.averageTotalScore.toFixed(2)}
			index={index}/>)}
	</ScrollView>;
}


const StatCard = styled.View`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 8px;
	padding: 10px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	align-items: center;
`;

const StatIcon = styled(Icon)<{color: string}>`
	font-size: 20px;
	color: ${props => props.color};
`;
