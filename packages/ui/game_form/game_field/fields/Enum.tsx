import {RadioButton} from "react-native-paper";
import {Subtitle} from "../../../index.ts";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";

type EnumProps = {
	value: string;
	setValue: (value: string) => void;
	values: object;
	color: string;
};

const ValueContainer = styled.View<{isSelected: boolean, color: string}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${props => props.isSelected ? (props.color + '20') : 'transparent'};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${props => props.color + (props.isSelected ? '' : '20')};
    margin-bottom: 8px;
`;

export const Enum = observer(({value, setValue, values, color}: EnumProps) => {
	return <RadioButton.Group
		onValueChange={setValue} value={value}>
		{Object.values(values || {}).map(key => <ValueContainer key={key} isSelected={value === key} color={color}>
			<RadioButton value={key} color={color} />
			<Subtitle>{key}</Subtitle>
		</ValueContainer>)}
	</RadioButton.Group>;
});
