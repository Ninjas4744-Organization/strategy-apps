import {LineChart} from "react-native-chart-kit";
import {Card, CardTitle} from "@/lib/components/admin/Card";
import {useState} from "react";
import {AdminTabProps, chartConfig} from "@/lib/components/admin/commons";

export const ScoreTrend = ({team}: AdminTabProps) => {
	const [chartWidth, setChartWidth] = useState(0);

	return <Card
		onLayout={(e) => {
			const { width } = e.nativeEvent.layout;
			setChartWidth(width);
		}}>
		<CardTitle>Score Trend Over Games</CardTitle>
		{chartWidth > 0 && (
			<LineChart
				data={{
					labels: team.games.map(game => game.gameNumber),
					datasets: [{ data: team.games.map(game => game.totalScore) }],
				}}
				width={chartWidth - 50}
				height={220}
				bezier
				chartConfig={chartConfig}
			/>
		)}
	</Card>;
};
