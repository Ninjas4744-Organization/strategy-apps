import {Stack, useLocalSearchParams} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {Subtitle, Title} from "../../../../components/styles/Text";
import {Row} from "../../../../components/styles/FlexDir";
import {StatItem} from "../../../../components/admin/StatItem";
import adminStore from "../../../../stores/admin_store";
import {Icon} from "../../../../components/Icon";
import {Colors} from "../../../../components/styles/colors";
import {Insight} from "../../../../interfaces/Insight";
import {Tabs} from "../../../../components/admin/Tabs";
import {OverviewTab} from "../../../../components/admin/team/OverviewTab";
import {GamesList} from "../../../../components/admin/team/GamesList";
import {ScoreTrend} from "../../../../components/admin/analytics/ScoreTrend";
import {AnalysisTab} from "../../../../components/admin/team/AnalysisTab";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled.View`
	margin: 8px;
	padding: 16px 10px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const AmberIcon = styled(Icon)`
	color: ${Colors.amber};
`;

const OrangeIcon = styled(Icon)`
	color: ${Colors.orange};
`;

const GreenIcon = styled(Icon)`
	color: ${Colors.green};
`;

export default observer(function () {
	const {id} = useLocalSearchParams();
	const {teams} = adminStore;
	const team = teams[Number.parseInt(id as string)];
	const bestGame = team.games.reduce((a, b) => a.totalScore > b.totalScore ? a : b);

	return <Container>
		<Stack.Screen options={{ title: `Team ${id}` }} />
		<PageHeader>
			<Row>
				<Title>Team {id}</Title>
			</Row>
			<Row>
				<StatItem icon="sports-esports" value={team.games.length} title="Games" />
				<StatItem icon="trending-up" value={team.averageTotalScore.toFixed(2)} title="Avg Score" />
				<StatItem icon="emoji-events" value={bestGame.totalScore} title="Best Score" />
				<StatItem icon="speed" value={(team.consistencyScore * 100).toFixed(2) + '%'} title="Consistency" />
			</Row>
		</PageHeader>
		<PageHeader>
			<Title><AmberIcon name="lightbulb" /> Performance Insights</Title>
			{team.insights.map((insight, index) => (
				<PerformanceInsight key={`${id}-inside-${index}`} {...insight} />
			))}
		</PageHeader>
		<Tabs
			tabs={{
				overview: {
					label: 'Overview',
					render: <OverviewTab team={team}/>,
				},
				games: {
					label: 'Games',
					render: <GamesList team={team}/>,
				},
				trends: {
					label: 'Trends',
					render: <ScoreTrend team={team}/>,
				},
				analysis: {
					label: 'Analysis',
					render: <AnalysisTab team={team}/>,
				},
			}} />
	</Container>;
});

const PerformanceInsight = ({message, isPositive}: Insight) => {
	return <Row>
		{isPositive ? <GreenIcon name="trending-up"/> : <OrangeIcon name="trending-down"/>}
		<Subtitle>{message}</Subtitle>
	</Row>
}
