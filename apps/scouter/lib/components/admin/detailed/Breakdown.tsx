import styled from "styled-components/native";
import {useState} from "react";
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {Card, CardTitle, Icon, Row, Col} from "@ninjas-strategy/ui";
import {chunkArray} from "@/lib/utilities";
import {BreakdownStat, ExtraStat} from "@ninjas-strategy/frc-games/types";
import {Game} from "@ninjas-strategy/frc-games";

const BreakdownStatContainer = styled.View<{color: string}>`
	flex: 1;
	padding: 12px;
	background-color: ${props => props.color}20;
	border: ${props => props.color}50;
	border-radius: 8px;
`;

const BreakdownStatIcon = styled(Icon)<{color: string}>`
	color: ${props => props.color};
	font-size: 24px;
`;

const BreakdownStatValue = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 20px;
	font-weight: bold;
`;

const BreakdownStatLabel = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 12px;
`;

const BreakdownStatNote = styled.Text<{color: string}>`
	color: ${props => props.color};
	font-size: 8px;
`;

type BreakdownSectionProps = {
	title: string;
	stats: BreakdownStat<Game>[];
	game: Game;
	extraStats: ExtraStat<Game>[];
	itemsPerRow?: number;
};

export const BreakdownSection = ({title, stats, game, extraStats, itemsPerRow = 0}: BreakdownSectionProps) => {
	const [breakdownItemsWidth, setBreakdownItemsWidth] = useState(0);

	const handleLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		setBreakdownItemsWidth(width);
	};

	const rows = chunkArray(stats, itemsPerRow);

	return <Card>
		<CardTitle>{title}</CardTitle>
		<Col onLayout={handleLayout}>
			{rows.map((row, index) => <BreakdownRow key={'row-' + index} game={game} stats={row} />)}
		</Col>
		<Col>
			{extraStats.filter(Boolean).map((stat, index) => (
				<ExtraBreakdownStatView
					key={title + '-stat-' + index}
					width={breakdownItemsWidth}
					{...stat}
					game={game}/>
			))}
		</Col>
	</Card>;
};

type BreakdownRowProps = {
	stats: BreakdownStat<Game>[];
	game: Game;
};

export const BreakdownRow = ({stats, game}: BreakdownRowProps) => (
	<Row>
		{stats.map((stat, index) => (
			<BreakdownStatContainer
				key={stat.label + '_' + index}
				color={stat.color}>
				<Col>
					{stat.icon && <BreakdownStatIcon name={stat.icon} color={stat.color}/>}
					<BreakdownStatValue color={stat.color}>{stat.val(game)}</BreakdownStatValue>
					<BreakdownStatLabel color={stat.color}>{stat.label}</BreakdownStatLabel>
					{stat.note && <BreakdownStatNote color={stat.color}>{stat.note(game)}</BreakdownStatNote>}
				</Col>
			</BreakdownStatContainer>
		))}
	</Row>
);

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

type ExtraBreakdownStatProps = ExtraStat<Game> & {
	game: Game;
	width: number;
};

const ExtraBreakdownStatView = ({color, icon, label, game, width}: ExtraBreakdownStatProps) => {
	return <ExtraBreakdownStatContainer color={color} width={width}>
		<ExtraBreakdownStatIcon color={color} name={icon} />
		<ExtraBreakdownStatText color={color}>{label(game)}</ExtraBreakdownStatText>
	</ExtraBreakdownStatContainer>;
};

type ScoreItemProps = {
	label: string;
	score: number;
	color: string;
};

export const ScoreItem = ({color, score, label}: ScoreItemProps) => {
	return <BreakdownStatContainer color={color}>
		<Col>
			<BreakdownStatValue color={color}>{score}</BreakdownStatValue>
			<BreakdownStatLabel color={color}>{label}</BreakdownStatLabel>
		</Col>
	</BreakdownStatContainer>;
};
