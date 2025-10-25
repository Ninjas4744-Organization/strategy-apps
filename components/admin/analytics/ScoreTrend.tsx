import {Title} from "../../styles/Text";
import {LineChart} from "react-native-chart-kit";
import {ChartWrapper} from "../ChartWrapper";
import {useState} from "react";
import {Game} from "../../../models/Game";
import {AbstractChartConfig} from "react-native-chart-kit/dist/AbstractChart";

type ScoreTrentProps = {
	games: Game[],
	chartConfig: AbstractChartConfig,
};

export const ScoreTrend = ({games, chartConfig}: ScoreTrentProps) => {
	const [chartWidth, setChartWidth] = useState(0);

	const gamesSorted = games.sort((a: Game, b: Game) => Number.parseInt(a.gameNumber) > Number.parseInt(b.gameNumber) ? 1 : -1);

	return <ChartWrapper
		onLayout={(e) => {
			const { width } = e.nativeEvent.layout;
			setChartWidth(width);
		}}>
		<Title>Score Trend Over Games</Title>
		{chartWidth > 0 && (
			<LineChart
				data={{
					labels: gamesSorted.map(game => game.gameNumber),
					datasets: [{ data: gamesSorted.map(game => game.totalScore) }],
				}}
				width={chartWidth - 50}
				height={220}
				bezier
				chartConfig={chartConfig}
			/>
		)}
	</ChartWrapper>;
};
