import {PieChart} from "react-native-chart-kit";
import {Card, CardTitle} from "@ninjas-strategy/ui";
import {useState} from "react";
import {AdminTabProps, chartConfig} from "@/lib/components/admin/commons";
import {appColors} from "@ninjas-strategy/ui";

export const Breakdown = ({team}: AdminTabProps) => {
	const [chartWidth, setChartWidth] = useState(0);
	return <Card
		onLayout={(e) => {
			const { width } = e.nativeEvent.layout;
			setChartWidth(width);
		}}>
		<CardTitle>Score Breakdown</CardTitle>
		<PieChart
			data={team.game.breakdownGraph.map(graph => ({
				...graph,
				name: graph.label,
				val: graph.val(team),
				legendFontColor: appColors.white,
			}))}
			paddingLeft="0"
			width={chartWidth}
			height={220}
			chartConfig={chartConfig}
			accessor="val"
			backgroundColor="transparent"
		/>
	</Card>;
};
