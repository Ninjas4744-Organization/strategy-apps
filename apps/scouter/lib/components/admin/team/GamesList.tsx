import {AdminTabProps} from "@/lib/components/admin/commons";
import {Game} from "@/lib/models/Game";
import {Card, CardTitle, Col, Row, Subtitle} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {appColors} from "@ninjas-strategy/ui";

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
			{game.game.gameCard.map((stat, index) => (
				<GameStat key={game.gameNumber + '-stat-' + index} {...stat} value={stat.val(game)} />
			))}
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

const GameStatContainer = styled.View`
	flex: 1;
`;

const Label = styled.Text<{color: string}>`
	font-size: 12px;
	font-weight: bold;
	color: ${props => props.color};
`;

const Value = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: ${appColors.white};
`;

const GameStat = ({label, value, color}: GameStatProps) => {
	return <GameStatContainer>
		<Col>
			<Label color={color}>{label}</Label>
			<Value>{value}</Value>
		</Col>
	</GameStatContainer>;
};
