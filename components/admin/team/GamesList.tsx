import {AdminTabProps} from "../commons";
import {Game} from "../../../models/Game";
import {Card, CardTitle} from "../Card";
import {Col, Row} from "../../styles/FlexDir";
import styled from "styled-components/native";
import {Colors} from "../../styles/colors";
import {CageLevel} from "../../../interfaces/CageLevel";
import {Subtitle} from "../../styles/Text";

export const GamesList = ({team}: AdminTabProps) => {
	return <>
		{team.games.map(game => <GameItem key={'game ' + game.gameNumber} game={game} />)}
	</>
}

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
			<GameStat label="Auto" value={game.autonomousScore} color={Colors.orange}/>
			<FlexGrow />
			<GameStat label="Teleop" value={game.teleopScore} color={Colors.green}/>
			<FlexGrow />
			<GameStat label="Cage Level" value={game.cageLevel || CageLevel.NONE} color={Colors.blue}/>
			<FlexGrow />
		</Row>
		<Row>
			<Subtitle>Date: {game.timestamp.toDateString()}</Subtitle>
			<FlexGrow />
		</Row>
	</Card>;
}

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
	color: ${Colors.white};
`;

const GameStat = ({label, value, color}: GameStatProps) => {
	return <Col>
		<Label color={color}>{label}</Label>
		<Value>{value}</Value>
	</Col>;
}
