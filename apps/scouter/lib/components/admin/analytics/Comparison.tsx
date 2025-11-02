import {Game} from "@/lib/models/Game";
import styled from "styled-components/native";
import {View} from "react-native";
import {Card} from "@/lib/components/admin/Card";
import {Row, Subtitle} from "@ninjas-strategy/ui";
import {AdminTabProps} from "@/lib/components/admin/commons";
import {MD2Colors} from "react-native-paper";

export const Comparison = ({team}: AdminTabProps) => {
	const bestGame = team.games.reduce((a, b) => a.totalScore > b.totalScore ? a : b);
	const worstGame  = team.games.reduce((a, b) => a.totalScore > b.totalScore ? b : a);

	return <>
		<ComparisonCard title="Best Game" game={bestGame} color={MD2Colors.green500} />
		<ComparisonCard title="Worst Game" game={worstGame} color={MD2Colors.red500} />
	</>;
};

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
	return <Card>
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
	</Card>;
};
