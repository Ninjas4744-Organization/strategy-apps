import {PieChart} from "react-native-chart-kit";
import {Colors} from "../../styles/colors";
import {Card, CardTitle} from "../Card";
import {useState} from "react";
import {AdminTabProps, chartConfig} from "../commons";

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
					color: Colors.orange,
					legendFontColor: Colors.white,
				},
				{
					name: `Teleop: ${team.averageTeleopScore.toFixed(2)}`,
					val: team.averageTeleopScore,
					color: Colors.green,
					legendFontColor: Colors.white,
				},
				{
					name: `Algae: ${team.averageAlgaeScore.toFixed(2)}`,
					val: team.averageAlgaeScore,
					color: Colors.blue,
					legendFontColor: Colors.white,
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
}
