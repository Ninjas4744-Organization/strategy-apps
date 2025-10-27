import {Stack, useLocalSearchParams} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import adminStore from "@/stores/adminStore";
import {ScoreTrend} from "@/components/admin/analytics/ScoreTrend";
import {Performance} from "@/components/admin/analytics/Performance";
import {Breakdown} from "@/components/admin/analytics/Breakdown";
import {Comparison} from "@/components/admin/analytics/Comparison";
import {StatItem} from "@/components/admin/StatItem";
import {Tabs} from "@/components/admin/Tabs";
import {MD2Colors} from "react-native-paper";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled.View`
	margin: 16px;
	padding: 20px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export default observer(function () {
	const {id} = useLocalSearchParams();
	const {teams} = adminStore;
	const team = teams[Number.parseInt(id as string)];

	return <Container>
		<Stack.Screen options={{ title: `Team ${id} Analytics` }} />
		<PageHeader>
			<StatItem icon="sports-esports" value={team.games.length} title="Games" />
			<StatItem icon="trending-up" value={team.averageTotalScore.toFixed(2)} title="Avg Score" />
			<StatItem icon="speed" value={(team.consistencyScore * 100).toFixed(2)} title="Consistency" />
		</PageHeader>
		<Tabs
			tabs={{
				score_trend: {
					label: 'Score Trend',
					render: <ScoreTrend team={team}/>,
				},
				performance: {
					label: 'Performance',
					render: <Performance team={team}/>,
				},
				breakdown: {
					label: 'Breakdown',
					render: <Breakdown team={team}/>,
				},
				comparison: {
					label: 'Comparison',
					render: <Comparison team={team} />,
				}
			}} />
	</Container>;
});
