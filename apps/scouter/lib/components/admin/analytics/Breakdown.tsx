import {PieChart} from "react-native-chart-kit";
import {Card, CardTitle} from "@ninjas-strategy/ui";
import {useState} from "react";
import {AdminTabProps, chartConfig} from "@/lib/components/admin/commons";
import {MD2Colors} from "react-native-paper";

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
				val: graph.val(team),
				legendFontColor: MD2Colors.white,
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
