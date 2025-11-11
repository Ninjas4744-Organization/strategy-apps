import {Game} from "@/lib/models/Game";
import styled from "styled-components/native";
import {useState} from "react";
import {TouchableOpacity} from "react-native";
import {Card, CardTitle, Row, Icon, Subtitle} from "@ninjas-strategy/ui";
import {MD2Colors} from "react-native-paper";
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {ExtraBreakdownStat} from "@/lib/interfaces/BreakdownStats";
import {BreakdownSection, ScoreItem} from "./Breakdown";
import {chunkArray} from "@/lib/utilities";

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
	const {gameDetailedBreakdowns} = game.game;
	return <>
		<ScoreSummary game={game}/>
		{gameDetailedBreakdowns.map((breakdown, index) => (
			<BreakdownSection
				key={'game-' + game.gameNumber + '-breakdown-' + index}
				title={breakdown.title}
				stats={breakdown.stats}
				extraStats={breakdown.extraStats}
				game={game} />
		))}
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
	const {scoreSummary} = game.game;

	const rows = chunkArray(scoreSummary, 2);

	return <Card>
		<CardTitle>Score Summary</CardTitle>
		{rows.map((row, rowIndex) => (
			<Row
				key={'game-' + game.gameNumber + '-summary-row-' + rowIndex}>
				{row.map((stat, statIndex) => (
					<ScoreItem
						key={'game-' + game.gameNumber + '-summary-' + statIndex}
						label={stat.label(game)}
						score={stat.val(game)}
						color={stat.color} />
				))}
			</Row>
		))}
	</Card>;
};

