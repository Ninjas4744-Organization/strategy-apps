import {MD2Colors, RadioButton} from "react-native-paper";
import {Subtitle} from "../../..";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";

type EnumProps = {
	value: string;
	setValue: (value: string) => void;
	values: object;
	title: string
};

const ValueContainer = styled.View<{isSelected: boolean, color: string}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${props => props.isSelected ? (MD2Colors.white + '20') : 'transparent'};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${MD2Colors.white}${props => (props.isSelected ? '' : '20')};
    margin-bottom: 8px;
`;

export const Enum = observer(({value, setValue, values, title}: EnumProps) => {
	return (
		<>
			<Subtitle>{title}</Subtitle>
			<RadioButton.Group onValueChange={setValue} value={value}>
				{Object.values(values || {}).map(key => <ValueContainer key={key} isSelected={value === key}>
					<RadioButton value={key} color={MD2Colors.white} />
					<Subtitle>{key}</Subtitle>
				</ValueContainer>)}
			</RadioButton.Group>
		</>
	);
});
