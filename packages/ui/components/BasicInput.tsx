import styled from "styled-components/native";
import {MD2Colors, TextInput, type TextInputProps} from "react-native-paper";
import {Icon} from "./Icon";
import {type MaterialIcon} from "../interfaces/MaterialIcon";

type BasicInputProps = TextInputProps & {
	iconRight?: MaterialIcon;
	iconLeft?: MaterialIcon;
}

const BasicInputContainer = styled(TextInput)`
	background-color: ${MD2Colors.white}70;
	border-radius: 16px;
`;

const BasicInputIcon = styled(Icon)`
	font-size: 24px;
	color: #555;
`;

export const BasicInput = ({...inputProps}: BasicInputProps) => {
	if (inputProps.iconLeft) {
		inputProps.left = <TextInput.Icon icon={() => <BasicInputIcon name={inputProps.iconLeft!} />} pointerEvents="none" />;
	}

	if (inputProps.iconRight) {
		inputProps.right = <TextInput.Icon icon={() => <BasicInputIcon name={inputProps.iconRight!} />} pointerEvents="none" />;
	}

	return <BasicInputContainer {...inputProps} underlineStyle={{display: 'none'}} />;
};
