import styled from "styled-components/native";
import {TextInput, TextInputIcon, type AppTextInputProps} from "../styles/TextInput";
import {Icon} from "./Icon";
import {type MaterialIcon} from "../interfaces/MaterialIcon";

type BasicInputProps = AppTextInputProps & {
	iconRight?: MaterialIcon;
	iconLeft?: MaterialIcon;
}

const BasicInputContainer = styled(TextInput)`
	min-width: 0;
`;

const BasicInputIcon = styled(Icon)`
	font-size: 24px;
	color: ${({theme}) => theme.textMuted};
	min-width: 0;
`;

export const BasicInput = ({iconLeft, iconRight, ...inputProps}: BasicInputProps) => {
	const left = iconLeft ? (
		<TextInputIcon icon={iconLeft} disabled />
	) : inputProps.left;

	const right = iconRight ? (
		<TextInputIcon icon={iconRight} disabled />
	) : inputProps.right;

	return (
		<BasicInputContainer
			{...inputProps}
			left={left}
			right={right}/>
	);
};
