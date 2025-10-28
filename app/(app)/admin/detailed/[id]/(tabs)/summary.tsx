import {observer} from "mobx-react-lite";
import {BreakdownRow, BreakdownSection} from '@/lib/components/admin/detailed/Breakdown';
import {useGlobalSearchParams} from "expo-router";
import adminStore from "@/lib/stores/adminStore";
import {MD2Colors} from "react-native-paper";
import {ScoreTrend} from '@/lib/components/admin/analytics/ScoreTrend';
import {BodyScroll} from '@/lib/components/styles/misc';
import {Card, CardTitle} from "@/lib/components/admin/Card";
import {Subtitle} from "@/lib/components/styles/Text";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = adminStore;
	const team = teams[Number.parseInt(id as string)];

	return <BodyScroll>
		<BreakdownSection
			title="Team Performance Summary"
			stats={[
				{
					label: 'Games Played',
					value: team.games.length,
					color: MD2Colors.blue500,
					icon: 'sports-esports',
				},
				{
					label: 'Avg Total',
					value: team.averageTotalScore.toFixed(2),
					color: MD2Colors.amber500,
					icon: 'trending-up',
				},
				{
					label: 'Avg Teleop',
					value: team.averageTeleopScore.toFixed(2),
					color: MD2Colors.green500,
					icon: 'sports',
				},
				{
					label: 'Avg Auto',
					value: team.averageAutonomousScore.toFixed(2),
					color: MD2Colors.purple500,
					icon: 'auto-awesome',
				},
				{
					label: 'Avg Cage Score',
					value: team.averageCageScore.toFixed(2),
					color: MD2Colors.amber500,
					icon: 'local-parking',
				},
				{
					label: 'Cage Games',
					value: `${team.cageGames}/${team.games.length}`,
					color: MD2Colors.orange500,
					icon: 'check-circle',
				},
			]}
			itemsPerRow={2}/>
		<ScoreTrend team={team}/>
		<Card>
			<CardTitle>Average Performance Breakdown</CardTitle>
			<Subtitle>Coral Scoring Averages:</Subtitle>
			<BreakdownRow
				stats={[
					{
						label: 'L1',
						value: team.averageL1.toFixed(2),
						color: MD2Colors.red500
					},
					{
						label: 'L2',
						value: team.averageL2.toFixed(2),
						color: MD2Colors.orange500
					},
					{
						label: 'L3',
						value: team.averageL3.toFixed(2),
						color: MD2Colors.yellow500
					},
					{
						label: 'L4',
						value: team.averageL4.toFixed(2),
						color: MD2Colors.green500
					}
				]} />
			<Subtitle>Algae Scoring Averages:</Subtitle>
			<BreakdownRow
				stats={[
					{
						label: 'Processed',
						value: team.averageAlgaeProcessed.toFixed(2),
						color: MD2Colors.blue500
					},
					{
						label: 'Net',
						value: team.averageAlgaeNet.toFixed(2),
						color: MD2Colors.cyan500
					},
				]} />
		</Card>
	</BodyScroll>;
});
