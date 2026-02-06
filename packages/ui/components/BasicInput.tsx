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
	min-width: 0;
`;

const BasicInputIcon = styled(Icon)`
	font-size: 24px;
	color: #555;
	min-width: 0;
`;

export const BasicInput = ({iconLeft, iconRight, ...inputProps}: BasicInputProps) => {
	const left = iconLeft ? (
		<TextInput.Icon
			icon={() => <BasicInputIcon name={iconLeft} />}
			disabled
			forceTextInputFocus={false}
			style={{minWidth: 0}}/>
	) : inputProps.left;

	const right = iconRight ? (
		<TextInput.Icon
			icon={() => <BasicInputIcon name={iconRight} />}
			disabled
			forceTextInputFocus={false}
			style={{minWidth: 0}}/>
	) : inputProps.right;

	return (
		<BasicInputContainer
			{...inputProps}
			left={left}
			right={right}
			underlineStyle={{display: 'none'}}/>
	);
};
