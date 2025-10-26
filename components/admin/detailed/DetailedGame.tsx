import {Game} from "../../../models/Game";
import styled from "styled-components/native";
import {useState} from "react";
import {Card, CardTitle} from "../Card";
import {Col, Row} from "../../styles/FlexDir";
import {TouchableOpacity} from "react-native";
import {Icon} from "../../Icon";
import {Subtitle} from "../../styles/Text";
import {MD2Colors} from "react-native-paper";
import {CageLevel} from "../../../interfaces/CageLevel";
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {MaterialIcons} from "@expo/vector-icons";

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
		<ScoringBreakdown
			title="Algae Scoring Breakdown"
			values={[game.coralsScoredL1, game.coralsScoredL2, game.coralsScoredL2, game.coralsScoredL4]}
			labels={['L1', 'L2', 'L3', 'L4']}
			colors={[MD2Colors.red500, MD2Colors.orange500, MD2Colors.yellow500, MD2Colors.green500]}
			points={[game.coralsScoredL1 + ' pts', game.coralsScoredL2 * 2 + ' pts', game.coralsScoredL3 * 3 + ' pts', game.coralsScoredL4 * 5 + ' pts']}
			extraStats={[
				{icon: 'close', text: `Missed: ${game.coralsMissed}`, color: MD2Colors.red500},
			]}/>
		<ScoringBreakdown
			title="Coral Scoring Breakdown"
			values={[game.algaeProcessed, game.algaeNet]}
			labels={['Processed', 'Net']}
			colors={[MD2Colors.blue500, MD2Colors.cyan500]}
			points={[game.algaeProcessed + ' pts', game.algaeNet * 2 + ' pts']}
			extraStats={[
				{icon: 'close', text: `Missed: Processed: ${game.algaeProcessedMissed}, Net: ${game.algaeNetMissed}`, color: MD2Colors.red500},
			]}/>
		<ScoringBreakdown
			title="Autonomous Performance"
			values={[game.autonomousCoralScore, game.autonomousAlgaeScore]}
			labels={['Corals', 'Algae']}
			points={['', '']}
			colors={[MD2Colors.purple500, MD2Colors.teal500]}
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
			].filter(Boolean) as BreakdownStat[]} />
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

type ScoreItemProps = {
	label: string;
	score: number;
	color: string;
};

const ScoreItemContainer = styled.View<{color: string}>`
	flex: 1;
	padding: 12px;
	background-color: ${props => props.color}20;
	border: ${props => props.color}50;
	border-radius: 8px;
`;

const Score = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 20px;
	font-weight: bold;
`;

const Label = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 12px;
`;

const ScoreItemPoints = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 8px;
`;

const ScoreItem = ({color, score, label}: ScoreItemProps) => {
	return <ScoreItemContainer color={color}>
		<Col>
			<Score color={color}>{score}</Score>
			<Label color={color}>{label}</Label>
		</Col>
	</ScoreItemContainer>;
};

type ScoringBreakdownProps = {
	title: string;
	values: number[];
	labels: string[];
	points: string[];
	colors: string[];
	extraStats: BreakdownStat[];
};

const ScoringBreakdown = ({title, values, colors, labels, points, extraStats = []}: ScoringBreakdownProps) => {
	const [scoreItemsWidth, setScoreItemsWidth] = useState(0);

	const handleLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		setScoreItemsWidth(width);
	};

	return <Card>
		<CardTitle>{title}</CardTitle>
		<Row onLayout={handleLayout}>
			{values.map((value, index) => (
				<ScoreItemContainer
					key={title + '_' + value + '_' + index}
					color={colors[index]}>
					<Col>
						<Score color={colors[index]}>{value}</Score>
						<Label color={colors[index]}>{labels[index]}</Label>
						{points[index] && <ScoreItemPoints color={colors[index]}>{points[index]}</ScoreItemPoints>}
					</Col>
				</ScoreItemContainer>
			))}
		</Row>
		<Col>
			{extraStats.filter(Boolean).map((stat, index) => <ExtraBreakdownStat key={title + '-stat-' + index} width={scoreItemsWidth} {...stat}/>)}
		</Col>
	</Card>;
};

type MaterialIcon = keyof typeof MaterialIcons.glyphMap;

type BreakdownStat = {
	color: string;
	icon: MaterialIcon;
	text: string;
};

const ExtraBreakdownStatContainer = styled.View<{color: string, width: number}>`
	width: ${props => props.width}px;
	padding: 12px;
	background-color: ${props => props.color}20;
	border: ${props => props.color}50;
	border-radius: 8px;
	flex-direction: row;
	align-items: start;
	gap: 8px;
`;

const ExtraBreakdownStatIcon = styled(Icon)<{color: string}>`
	font-size: 16px;
	color: ${props => props.color};
`;

const ExtraBreakdownStatText = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 14px;
	flex-wrap: wrap;
`;

type ExtraBreakdownStatProps = BreakdownStat & {
	width: number;
};

const ExtraBreakdownStat = ({color, icon, text, width}: ExtraBreakdownStatProps) => {
	return <ExtraBreakdownStatContainer color={color} width={width}>
		<ExtraBreakdownStatIcon color={color} name={icon} />
		<ExtraBreakdownStatText color={color}>{text}</ExtraBreakdownStatText>
	</ExtraBreakdownStatContainer>;
};
