import {Game} from "@/lib/models/Game";
import styled from "styled-components/native";
import {useState} from "react";
import {TouchableOpacity} from "react-native";
import {Card, CardTitle, Row, Icon, Subtitle} from "@ninjas-strategy/ui";
import {MD2Colors} from "react-native-paper";
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {ExtraBreakdownStat} from "@/lib/interfaces/BreakdownStats";
import {BreakdownSection, ScoreItem} from "./Breakdown";

type DetailedGameProps = {
	game: Game;
}

const FlexGrow = styled.View`
	flex-grow: 1;
`;

export const DetailedGame = ({game}: DetailedGameProps) => {
	const [expanded, setExpanded] = useState(false);
	return <Card>
		<Row>
			<CardTitle>Game {game.gameNumber}</CardTitle>
			<FlexGrow />
			<TouchableOpacity onPress={() => setExpanded(!expanded)}>
				<Icon name={`keyboard-arrow-${expanded ? 'up' : 'down'}`} />
			</TouchableOpacity>
		</Row>
		<Row>
			<Subtitle>Total Score: {game.totalScore} • {game.timestamp.toDateString()}</Subtitle>
			<FlexGrow />
		</Row>
		{expanded && <ExpandedGameView game={game}/>}
	</Card>;
};

const ExpandedGameView = ({game}: DetailedGameProps) => {
	return <>
		<ScoreSummary game={game}/>
		<BreakdownSection
			title="Algae Scoring Breakdown"
			stats={[
				{
					label: 'L1',
					value: game.coralsScoredL1,
					note: game.coralsScoredL1 + ' pts',
					color: MD2Colors.red500,
				},
				{
					label: 'L2',
					value: game.coralsScoredL2,
					note: (game.coralsScoredL2 * 2) + ' pts',
					color: MD2Colors.orange500,
				},
				{
					label: 'L3',
					value: game.coralsScoredL3,
					note: (game.coralsScoredL3 * 3) + ' pts',
					color: MD2Colors.yellow500,
				},
				{
					label: 'L4',
					value: game.coralsScoredL4,
					note: (game.coralsScoredL4 * 5) + ' pts',
					color: MD2Colors.green500,
				}
			]}
			extraStats={[
				{icon: 'close', text: `Missed: ${game.coralsMissed}`, color: MD2Colors.red500},
			]}/>
		<BreakdownSection
			title="Coral Scoring Breakdown"
			stats={[
				{label: 'Processed', value: game.algaeProcessed, note: game.algaeProcessed + ' pts', color: MD2Colors.blue500,},
				{label: 'Net', value: game.algaeNet, note: (game.algaeNet * 2) + ' pts', color: MD2Colors.cyan500,},
			]}
			extraStats={[
				{icon: 'close', text: `Missed: Processed: ${game.algaeProcessedMissed}, Net: ${game.algaeNetMissed}`, color: MD2Colors.red500},
			]}/>
		<BreakdownSection
			title="Autonomous Performance"
			stats={[
				{label: 'Corals', value: game.autonomousCoralScore, color: MD2Colors.purple500,},
				{label: 'Algae', value: game.autonomousAlgaeScore, color: MD2Colors.teal500,},
			]}
			extraStats={[
				{
					icon: 'auto-awesome',
					text: `Autonomous Corals: L1: ${game.autonomousCoralsScoredL1}, L2: ${game.autonomousCoralsScoredL2}, L3: ${game.autonomousCoralsScoredL3}, L4: ${game.autonomousCoralsScoredL4}`,
					color: MD2Colors.purple500,
				},
				{
					icon: 'water-drop',
					text: `Autonomous Algae: Processed: ${game.autonomousAlgaeProcessed} (Missed: ${game.autonomousAlgaeProcessedMissed}), Net: ${game.autonomousAlgaeNet} (Missed: ${game.autonomousAlgaeNetMissed})`,
					color: MD2Colors.teal500
				},
				game.parkingScore > 0 && {
					icon: 'local-parking',
					text: `Cage Level: ${game.cageLevel?.toUpperCase() ?? 'N/A'} (+${game.parkingScore} points)`,
					color: MD2Colors.amber500
				},
			].filter(Boolean) as ExtraBreakdownStat[]} />
		<Card>
			<CardTitle>Autonomous Performance</CardTitle>
			<Row>
				<ScoreItem label="Corals" score={game.autonomousCoralScore} color={MD2Colors.purple500}/>
				<ScoreItem label="Corals" score={game.autonomousAlgaeScore} color={MD2Colors.teal500}/>
			</Row>
		</Card>
	</>;
};

const ScoreSummary = ({game}: DetailedGameProps) => {
	return <Card>
		<CardTitle>Score Summary</CardTitle>
		<Row>
			<ScoreItem label="Total" score={game.totalScore} color={MD2Colors.amber500} />
			<ScoreItem label="Teleop" score={game.teleopScore} color={MD2Colors.blue500} />
		</Row>
		<Row>
			<ScoreItem label="Autonomous" score={game.autonomousScore} color={MD2Colors.green500} />
			<ScoreItem label={(game.cageLevel || CageLevel.NONE).toUpperCase()} score={game.parkingScore} color={MD2Colors.orange500} />
		</Row>
	</Card>;
};

