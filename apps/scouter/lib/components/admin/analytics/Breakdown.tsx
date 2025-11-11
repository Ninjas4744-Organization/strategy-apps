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
			data={[
				{
					name: `Auto: ${team.getAverageScore('autonomousScore').toFixed(1)}`,
					val: team.getAverageScore('autonomousScore'),
					color: MD2Colors.orange500,
					legendFontColor: MD2Colors.white,
				},
				{
					name: `Teleop: ${team.getAverageScore('teleopScore').toFixed(1)}`,
					val: team.getAverageScore('teleopScore'),
					color: MD2Colors.green500,
					legendFontColor: MD2Colors.white,
				},
				{
					name: `Algae: ${team.getAverageScore('algaeScore').toFixed(1)}`,
					val: team.getAverageScore('algaeScore'),
					color: MD2Colors.blue500,
					legendFontColor: MD2Colors.white,
				}
			]}
			paddingLeft="0"
			width={chartWidth}
			height={220}
			chartConfig={chartConfig}
			accessor="val"
			backgroundColor="transparent"
		/>
	</Card>;
};
