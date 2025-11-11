import {observer} from "mobx-react-lite";
import {BreakdownRow, BreakdownSection} from '@/lib/components/admin/detailed/Breakdown';
import {useGlobalSearchParams} from "expo-router";
import {MD2Colors} from "react-native-paper";
import {ScoreTrend} from '@/lib/components/admin/analytics/ScoreTrend';
import {BodyScroll, FocusWrapper, Subtitle, Card, CardTitle} from "@ninjas-strategy/ui";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = useContext(EventContext) as EventStore;
	const team = teams[Number.parseInt(id as string)];

	return <BodyScroll>
		<FocusWrapper>
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
						value: team.averageTotalScore.toFixed(1),
						color: MD2Colors.amber500,
						icon: 'trending-up',
					},
					{
						label: 'Avg Teleop',
						value: team.getAverageScore('teleopScore').toFixed(1),
						color: MD2Colors.green500,
						icon: 'sports',
					},
					{
						label: 'Avg Auto',
						value: team.getAverageScore('autonomousScore').toFixed(1),
						color: MD2Colors.purple500,
						icon: 'auto-awesome',
					},
					{
						label: 'Avg Cage Score',
						value: team.getAverageScore('parkingScore').toFixed(1),
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
							value: team.getAverageValue('corals_scored_l1').toFixed(1),
							color: MD2Colors.red500
						},
						{
							label: 'L2',
							value: team.getAverageValue('corals_scored_l2').toFixed(1),
							color: MD2Colors.orange500
						},
						{
							label: 'L3',
							value: team.getAverageValue('corals_scored_l3').toFixed(1),
							color: MD2Colors.yellow500
						},
						{
							label: 'L4',
							value: team.getAverageValue('corals_scored_l4').toFixed(1),
							color: MD2Colors.green500
						}
					]} />
				<Subtitle>Algae Scoring Averages:</Subtitle>
				<BreakdownRow
					stats={[
						{
							label: 'Processed',
							value: team.getAverageValue('algae_processed').toFixed(1),
							color: MD2Colors.blue500
						},
						{
							label: 'Net',
							value: team.getAverageValue('algae_net').toFixed(1),
							color: MD2Colors.cyan500
						},
					]} />
			</Card>
		</FocusWrapper>
	</BodyScroll>;
});
