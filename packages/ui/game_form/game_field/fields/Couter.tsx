import styled from "styled-components/native";
import {Icon, Subtitle} from "../../..";
import {appColors} from "../../../styles";
import {observer} from "mobx-react-lite";

type CounterProps = {
	title: string;
	color: string;
	missed: number;
	scored: number;
	setMissed: (missed: number) => void;
	setScored: (scored: number) => void;
};

const CounterContainer = styled.View<{ color: string, themeColor: string }>`
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

const CounterHeader = styled.View`
    gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CounterValuesRow = styled.View`
	display: flex;
	flex-direction: row;
`;

export const Counter = ({title, color, missed, setMissed, scored, setScored}: CounterProps) => {
	return <CounterContainer color={appColors.white} themeColor={color}>
		<CounterHeader>
			<Icon name="star" color={color} size={24} />
			<Subtitle>{title}</Subtitle>
		</CounterHeader>
		<CounterValuesRow>
			<CounterValue color={appColors.red500} title="Missed" value={missed} onChange={setMissed} />
			<CounterValue color={appColors.green500} title="Scored" value={scored} onChange={setScored} />
		</CounterValuesRow>
	</CounterContainer>;
};

type CounterValueProps = {
	color: string;
	title: string;
	value: number;
	onChange: (value: number) => void;
};

const CounterValueContainer = styled.View<{color: string}>`
	padding: 8px;
	margin: 4px;
	border-radius: 8px;
	background-color: ${props => props.color}50;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`;

const CountersContainer = styled.View`
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

export const CounterValue = observer(({color, title, value, onChange}: CounterValueProps) => {
	return <CounterValueContainer color={color}>
		<Subtitle>{title}</Subtitle>
		<CountersContainer>
			<CounterButton onPress={() => onChange(value - 1)} disabled={value === 0}>
				<Icon name="remove" />
			</CounterButton>
			<Subtitle>{value}</Subtitle>
			<CounterButton onPress={() => onChange(value + 1)}>
				<Icon name="add" />
			</CounterButton>
		</CountersContainer>
	</CounterValueContainer>;
});
