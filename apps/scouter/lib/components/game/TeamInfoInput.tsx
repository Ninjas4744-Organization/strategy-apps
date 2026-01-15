import styled from "styled-components/native";
import {MD2Colors, TextInput, type TextInputProps} from "react-native-paper";
import {Icon} from "@ninjas-strategy/ui";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

type TeamInfoInputProps = TextInputProps & {
	iconRight?: MaterialIcon;
	iconLeft?: MaterialIcon;
}

const TeamInfoInputContainer = styled(TextInput)`
	background-color: ${MD2Colors.white}70;
	border-radius: 16px;
`;

const TeamInfoInputIcon = styled(Icon)`
	font-size: 24px;
	color: #555;
`;

export const TeamInfoInput = ({...inputProps}: TeamInfoInputProps) => {
	if (inputProps.iconLeft) {
		inputProps.left = <TextInput.Icon icon={() => <TeamInfoInputIcon name={inputProps.iconLeft!} />} pointerEvents="none" />;
	}

	if (inputProps.iconRight) {
		inputProps.right = <TextInput.Icon icon={() => <TeamInfoInputIcon name={inputProps.iconRight!} />} pointerEvents="none" />;
	}

	return <TeamInfoInputContainer {...inputProps} underlineStyle={{display: 'none'}} />;
};
