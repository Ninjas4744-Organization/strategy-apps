import {Subtitle} from "../../..";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {Radio} from "../../../components/Radio";

type EnumProps = {
	value: string;
	onChange: (value: string) => void;
	values: object;
	title: string
};

const ValueContainer = styled.Pressable<{isSelected: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${({theme, isSelected}) => isSelected ? `${theme.primary}20` : 'transparent'};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${({theme, isSelected}) => isSelected ? theme.primary : theme.border};
    margin-bottom: 8px;
    padding: 10px 12px;
`;

export const Enum = observer(({value, onChange, values, title}: EnumProps) => {
	return (
		<>
			<Subtitle>{title}</Subtitle>
			{Object.values(values || {}).map(key => <ValueContainer key={key} isSelected={value === key} onPress={() => onChange(key)}>
					<Radio selected={value === key} />
					<Subtitle>{key}</Subtitle>
				</ValueContainer>)}
		</>
	);
});
