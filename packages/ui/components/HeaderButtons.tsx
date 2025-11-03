import styled from "styled-components/native";
import {Icon} from "@ninjas-strategy/ui";
import type {MaterialIcon} from "../interfaces/MaterialIcon";

type HeaderButtonsProps = {
	buttons: HeaderButtonProps[];
};

const HeaderButtonsContainer = styled.View`
	display: flex;
	flex-direction: row;
	background-color: transparent;
`;

const Button = styled.TouchableOpacity`
	margin: 10px 15px;
`;

export const HeaderButtons = ({buttons}: HeaderButtonsProps) => {
	return <HeaderButtonsContainer>
		{buttons.map((button, index) => <HeaderButton key={"button-" + index} {...button} />)}
	</HeaderButtonsContainer>;
};

type HeaderButtonProps = {
	onPress: () => void;
	icon: MaterialIcon;
};

const HeaderButton = ({onPress, icon}: HeaderButtonProps) => {
	return <Button onPress={onPress}>
		<Icon name={icon} />
	</Button>;
}
