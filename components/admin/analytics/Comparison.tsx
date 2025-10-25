import {Game} from "../../../models/Game";
import styled from "styled-components/native";
import {Subtitle} from "../../styles/Text";
import {View} from "react-native";
import {ChartWrapper} from "../ChartWrapper";
import {Row} from "../../styles/Row";
import {Colors} from "../../styles/colors";

type ComparisonProps = {
	games: Game[];
};
export const Comparison = ({games}: ComparisonProps) => {
	const bestGame = games.reduce((a, b) => a.totalScore > b.totalScore ? a : b);
	const worstGame  = games.reduce((a, b) => a.totalScore > b.totalScore ? b : a);

	return <>
		<ComparisonCard title="Best Game" game={bestGame} color={Colors.green} />
		<ComparisonCard title="Worst Game" game={worstGame} color={Colors.red} />
	</>;
}

type ComparisonCardProps = {
	title: string,
	game: Game,
	color: string
};

const ComparisonCardTitle = styled.Text<{color: string}>`
	font-size: 14px;
	font-weight: bold;
	color: ${props => props.color};
`;

const ComparisonCard = ({title, game, color}: ComparisonCardProps) => {
	return <ChartWrapper>
		<ComparisonCardTitle color={color}>{title}</ComparisonCardTitle>
		<Row>
			<Subtitle>Game {game.gameNumber}</Subtitle>
			<View style={{flexGrow: 1}} />
			<ComparisonCardTitle color={color}>{game.totalScore} pts</ComparisonCardTitle>
		</Row>
		<Row>
			<Subtitle>Auto: {game.autonomousScore}</Subtitle>
			<View style={{flexGrow: 1}} />
			<Subtitle>Teleop: {game.teleopScore}</Subtitle>
			<View style={{flexGrow: 1}} />
			<Subtitle>Algae: {game.algaeScore}</Subtitle>
		</Row>
	</ChartWrapper>
}
