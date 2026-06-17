import {Subtitle} from "../../..";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {Radio} from "../../../components/Radio";

type EnumProps = {
	value: string;
	setValue: (value: string) => void;
	values: object;
	color: string;
};

const ValueContainer = styled.Pressable<{ $selected: boolean; $color: string }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${({theme, $selected, $color}) => $selected ? `${$color}20` : theme.inputBackground};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${({theme, $selected, $color}) => $selected ? $color : theme.border};
    margin-bottom: 8px;
    padding: 10px 12px;
`;

export const Enum = observer(({value, setValue, values, color}: EnumProps) => {
	return <>
		{Object.values(values || {}).map(key => <ValueContainer key={key} $selected={value === key} $color={color} onPress={() => setValue(key)}>
			<Radio selected={value === key} color={color} inactiveColor={`${color}33`} />
			<OptionText $selected={value === key} $color={color}>{key}</OptionText>
		</ValueContainer>)}
	</>;
});

const OptionText = styled(Subtitle)<{ $selected: boolean; $color: string }>`
	color: ${({theme, $selected, $color}) => $selected ? $color : theme.text};
	font-size: 16px;
	font-weight: 700;
`;
