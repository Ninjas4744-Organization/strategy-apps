import {Href, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {Subtitle, Title} from "../../../../components/styles/Text";
import {Row} from "../../../../components/styles/FlexDir";
import {StatItem} from "../../../../components/admin/StatItem";
import adminStore from "../../../../stores/admin_store";
import {Icon} from "../../../../components/Icon";
import {Insight} from "../../../../interfaces/Insight";
import {Tabs} from "../../../../components/admin/Tabs";
import {OverviewTab} from "../../../../components/admin/team/OverviewTab";
import {GamesList} from "../../../../components/admin/team/GamesList";
import {ScoreTrend} from "../../../../components/admin/analytics/ScoreTrend";
import {AnalysisTab} from "../../../../components/admin/team/AnalysisTab";
import {MD2Colors} from "react-native-paper";
import {SimpleButton} from "../../../../components/styles/SimpleButton";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled.View`
	margin: 8px;
	padding: 16px 10px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const AmberIcon = styled(Icon)`
	color: ${MD2Colors.amber500};
`;

const OrangeIcon = styled(Icon)`
	color: ${MD2Colors.orange500};
`;

const GreenIcon = styled(Icon)`
	color: ${MD2Colors.green500};
`;

export default observer(function () {
	const {id} = useLocalSearchParams();
	const router = useRouter();
	const {teams} = adminStore;
	const team = teams[Number.parseInt(id as string)];
	const bestGame = team.games.reduce((a, b) => a.totalScore > b.totalScore ? a : b);

	return <Container>
		<Stack.Screen
			options={{
				title: `Team ${id}`,
				headerRight: () => (
					<SimpleButton onPress={() => router.push(`/admin/detailed/${id}` as Href)}>
						<Icon name="analytics" />
						<Subtitle>Detailed View</Subtitle>
					</SimpleButton>
				)
			}} />
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
	</Row>;
};
