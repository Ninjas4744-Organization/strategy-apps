import styled from "styled-components/native";
import {Col, Row} from "../../styles/FlexDir";
import {BreakdownStat, ExtraBreakdownStat} from "../../../interfaces/BreakdownStats";
import {useState} from "react";
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {Card, CardTitle} from "../Card";
import {Icon} from "../../Icon";

const BreakdownStatContainer = styled.View<{color: string}>`
	flex: 1;
	padding: 12px;
	background-color: ${props => props.color}20;
	border: ${props => props.color}50;
	border-radius: 8px;
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
	stats: BreakdownStat[];
	extraStats?: ExtraBreakdownStat[];
};

export const BreakdownSection = ({title, stats, extraStats = []}: BreakdownSectionProps) => {
	const [breakdownItemsWidth, setBreakdownItemsWidth] = useState(0);

	const handleLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		setBreakdownItemsWidth(width);
	};

	return <Card>
		<CardTitle>{title}</CardTitle>
		<Row onLayout={handleLayout}>
			{stats.map((stat, index) => (
				<BreakdownStatContainer
					key={title + '_' + stat.value + '_' + index}
					color={stat.color}>
					<Col>
						<BreakdownStatValue color={stat.color}>{stat.value}</BreakdownStatValue>
						<BreakdownStatLabel color={stat.color}>{stat.label}</BreakdownStatLabel>
						{stat.note && <BreakdownStatNote color={stat.color}>{stat.note}</BreakdownStatNote>}
					</Col>
				</BreakdownStatContainer>
			))}
		</Row>
		<Col>
			{extraStats.filter(Boolean).map((stat, index) => <ExtraBreakdownStatView key={title + '-stat-' + index} width={breakdownItemsWidth} {...stat}/>)}
		</Col>
	</Card>;
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

type ExtraBreakdownStatProps = ExtraBreakdownStat & {
	width: number;
};

const ExtraBreakdownStatView = ({color, icon, text, width}: ExtraBreakdownStatProps) => {
	return <ExtraBreakdownStatContainer color={color} width={width}>
		<ExtraBreakdownStatIcon color={color} name={icon} />
		<ExtraBreakdownStatText color={color}>{text}</ExtraBreakdownStatText>
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
