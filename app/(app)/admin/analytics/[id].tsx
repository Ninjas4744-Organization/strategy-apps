import {Stack, useLocalSearchParams} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import adminStore from "../../../../stores/admin_store";
import {Icon} from "../../../../components/Icon";
import {Subtitle, Text, Title} from "../../../../components/styles/Text";
import {useState} from "react";
import {Colors} from "../../../../components/styles/colors";
import {ScrollView, View} from "react-native";
import {Team} from "../../../../models/Team";
import {LineChart, PieChart} from "react-native-chart-kit";
import {Game} from "../../../../models/Game";
import {ProgressBar} from "react-native-paper";
import {ScoreTrend} from "../../../../components/admin/analytics/ScoreTrend";
import {Performance} from "../../../../components/admin/analytics/Performance";
import {Breakdown} from "../../../../components/admin/analytics/Breakdown";
import {Comparison} from "../../../../components/admin/analytics/Comparison";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled.View`
	margin: 16px;
	padding: 20px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StatItem = styled.View`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`;

const TabContainer = styled.View`
	flex-direction: row;
	height: 44px;
	margin: 16px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
	flex: 1;
	margin-right: 8px;
	padding: 8px;
	align-items: center;
	justify-content: center;
	background-color: ${Colors.white}${({ active }) => (active ? '' : "10")};
	border-radius: 20px;
	border: ${Colors.white}20;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? Colors.black : Colors.white};
  font-weight: 600;
`;

type AnalyticsTab = 'score_trend' | 'performance' | 'breakdown' | 'comparison';

export default observer(function () {
	const {id} = useLocalSearchParams();
	const [tab, setTab] = useState<AnalyticsTab>('score_trend');

	const {teams} = adminStore;

	const team = teams[Number.parseInt(id as string)];

	return <Container>
		<Stack.Screen options={{ title: `Team ${id} Analytics` }} />
		<PageHeader>
			<StatItem>
				<Icon name="sports-esports" />
				<Title>{team.games.length}</Title>
				<Subtitle>Games</Subtitle>
			</StatItem>
			<StatItem>
				<Icon name="trending-up" />
				<Title>{team.averageTotalScore.toFixed(2)}</Title>
				<Subtitle>Avg Score</Subtitle>
			</StatItem>
			<StatItem>
				<Icon name="speed" />
				<Title>{(team.consistencyScore * 100).toFixed(2)}</Title>
				<Subtitle>Consistency</Subtitle>
			</StatItem>
		</PageHeader>
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{
				height: 44,
				flexGrow: 0,
				flexShrink: 0,
			}}
			contentContainerStyle={{
				alignItems: 'center',
			}}>
			<TabContainer>
				<TabButton active={tab === "score_trend"} onPress={() => setTab("score_trend")}>
					<TabText active={tab === "score_trend"}>Score Trend</TabText>
				</TabButton>
				<TabButton active={tab === "performance"} onPress={() => setTab("performance")}>
					<TabText active={tab === "performance"}>Performance</TabText>
				</TabButton>
				<TabButton active={tab === "breakdown"} onPress={() => setTab("breakdown")}>
					<TabText active={tab === "breakdown"}>Breakdown</TabText>
				</TabButton>
				<TabButton active={tab === "comparison"} onPress={() => setTab("comparison")}>
					<TabText active={tab === "comparison"}>Comparison</TabText>
				</TabButton>
			</TabContainer>
		</ScrollView>
		<CurrentTab team={team} tab={tab} />
	</Container>;
});

type CurrentTabProps = {
	team: Team,
	tab: AnalyticsTab
};

const CurrentTabContainer = styled.View`
	flex: 1;
`;

const ChartWrapper = styled.View`
	margin: 16px;
	padding: 20px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const CurrentTab = ({ team, tab }: CurrentTabProps) => {
	const chartConfig = {
		color: () => Colors.white,
		backgroundGradientFromOpacity: 0,
		backgroundGradientToOpacity: 0,
	};

	return (
		<CurrentTabContainer>
			{tab === 'score_trend' && <ScoreTrend games={team.games} chartConfig={chartConfig}/>}
			{tab === 'performance' && <Performance team={team}/>}
			{tab === 'breakdown' && <Breakdown team={team} chartConfig={chartConfig}/>}
			{tab === 'comparison' && <Comparison games={team.games} />}
		</CurrentTabContainer>
	);
};


