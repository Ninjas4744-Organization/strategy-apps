import {AdminTabProps} from "@/lib/components/admin/commons";
import {Game} from "@/lib/models/Game";
import {Card, CardTitle} from "@/lib/components/admin/Card";
import {Col, Row, Subtitle} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {MD2Colors} from "react-native-paper";

export const GamesList = ({team}: AdminTabProps) => {
	return <>
		{team.games.map(game => <GameItem key={'game ' + game.gameNumber} game={game} />)}
	</>;
};

type GameItemProps = {
	game: Game;
};

const FlexGrow = styled.View`
	flex-grow: 1;
`;

const GameItem = ({game}: GameItemProps) => {
	return <Card>
		<Row>
			<CardTitle>Game {game.gameNumber}</CardTitle>
			<FlexGrow/>
			<CardTitle>{game.totalScore} pts</CardTitle>
		</Row>
		<Row>
			<FlexGrow />
			<GameStat label="Auto" value={game.autonomousScore} color={MD2Colors.orange500}/>
			<FlexGrow />
			<GameStat label="Teleop" value={game.teleopScore} color={MD2Colors.green500}/>
			<FlexGrow />
			<GameStat label="Cage Level" value={game.cageLevel} color={MD2Colors.blue500}/>
			<FlexGrow />
		</Row>
		<Row>
			<Subtitle>Date: {game.timestamp.toDateString()}</Subtitle>
			<FlexGrow />
		</Row>
	</Card>;
};

type GameStatProps = {
	label: string;
	value: number|string;
	color: string;
};

const Label = styled.Text<{color: string}>`
	font-size: 12px;
	font-weight: bold;
	color: ${props => props.color};
`;

const Value = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: ${MD2Colors.white};
`;

const GameStat = ({label, value, color}: GameStatProps) => {
	return <Col>
		<Label color={color}>{label}</Label>
		<Value>{value}</Value>
	</Col>;
};
