import {PieChart} from "react-native-chart-kit";
import {Card, CardTitle} from "@/components/admin/Card";
import {useState} from "react";
import {AdminTabProps, chartConfig} from "@/components/admin/commons";
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
					name: `Auto: ${team.averageAutonomousScore.toFixed(2)}`,
					val: team.averageAutonomousScore,
					color: MD2Colors.orange500,
					legendFontColor: MD2Colors.white,
				},
				{
					name: `Teleop: ${team.averageTeleopScore.toFixed(2)}`,
					val: team.averageTeleopScore,
					color: MD2Colors.green500,
					legendFontColor: MD2Colors.white,
				},
				{
					name: `Algae: ${team.averageAlgaeScore.toFixed(2)}`,
					val: team.averageAlgaeScore,
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
