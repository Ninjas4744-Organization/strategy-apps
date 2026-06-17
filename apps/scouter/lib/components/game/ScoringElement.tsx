import styled from "styled-components/native";
import {Icon, Subtitle} from "@ninjas-strategy/ui";
import {appColors} from "@ninjas-strategy/ui";

type ScoringElementProps = {
	title: string;
	color: string;
	missed: number;
	scored: number;
	setMissed: (missed: number) => void;
	setScored: (scored: number) => void;
};

const ScoringElementContainer = styled.View<{ color: string, themeColor: string }>`
	margin: 8px;
	padding: 12px;
	background-color: ${props => props.color}50;
	gap: 16px;
	border-width: 1px;
	border-color: ${props => props.themeColor};
	border-radius: 12px;
	display: flex;
	flex-direction: column;
`;

const SectionElementHeader = styled.View`
    gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StarIcon = styled(Icon)<{color: string}>`
	font-size: 24px;
	color: ${props => props.color};
`;

const ScoringElementValuesRow = styled.View`
	display: flex;
	flex-direction: row;
`;

export const ScoringElement = ({title, color, missed, setMissed, scored, setScored}: ScoringElementProps) => {
	return <ScoringElementContainer color={appColors.white} themeColor={color}>
		<SectionElementHeader>
			<StarIcon name="star" color={color} size={24} />
			<Subtitle>{title}</Subtitle>
		</SectionElementHeader>
		<ScoringElementValuesRow>
			<ScoringElementValue color={appColors.red500} title="Missed" value={missed} onChange={setMissed} />
			<ScoringElementValue color={appColors.green500} title="Scored" value={scored} onChange={setScored} />
		</ScoringElementValuesRow>
	</ScoringElementContainer>;
};

type ScoringElementValueProps = {
	color: string;
	title: string;
	value: number;
	onChange: (value: number) => void;
};

const ScoringElementValueContainer = styled.View<{color: string}>`
	padding: 8px;
	margin: 4px;
	border-radius: 8px;
	background-color: ${props => props.color}50;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`;

const CounterContainer = styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
`;

const CounterButton = styled.TouchableOpacity`
	padding: 8px;
	margin: 4px;
	background-color: ${appColors.white}10;
	border: ${appColors.white}20;
	border-radius: 8px;
`;

const ScoringElementValue = ({color, title, value, onChange}: ScoringElementValueProps) => {
	return <ScoringElementValueContainer color={color}>
		<Subtitle>{title}</Subtitle>
		<CounterContainer>
			<CounterButton onPress={() => onChange(value - 1)} disabled={value === 0}>
				<Icon name="remove" />
			</CounterButton>
			<Subtitle>{value}</Subtitle>
			<CounterButton onPress={() => onChange(value + 1)}>
				<Icon name="add" />
			</CounterButton>
		</CounterContainer>
	</ScoringElementValueContainer>;
};
