import {Subtitle} from "../../..";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";

type EnumProps = {
	value: string;
	setValue: (value: string) => void;
	values: object;
	color: string;
};

const ValueContainer = styled.Pressable<{isSelected: boolean, color: string}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${props => props.isSelected ? (props.color + '20') : 'transparent'};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${props => props.color + (props.isSelected ? '' : '20')};
    margin-bottom: 8px;
    padding: 10px 12px;
`;

export const Enum = observer(({value, setValue, values, color}: EnumProps) => {
	return <>
		{Object.values(values || {}).map(key => <ValueContainer key={key} isSelected={value === key} color={color} onPress={() => setValue(key)}>
			<RadioDot isSelected={value === key} color={color} />
			<Subtitle>{key}</Subtitle>
		</ValueContainer>)}
	</>;
});

const RadioDot = styled.View<{isSelected: boolean, color: string}>`
	width: 22px;
	height: 22px;
	border-radius: 11px;
	border-width: 2px;
	border-color: ${({color}) => color};
	background-color: ${({isSelected, color}) => isSelected ? color : "transparent"};
`;
