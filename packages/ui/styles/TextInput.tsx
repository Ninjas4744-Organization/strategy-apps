import styled from "styled-components/native";
import {
	TextInput as NativeTextInput,
	type TextInputProps as NativeTextInputProps,
	type ViewStyle,
} from "react-native";
import type {ReactElement, ReactNode} from "react";
import {Icon} from "../components/Icon";

type TextInputIconProps = {
	icon: string;
	onPress?: () => void;
	disabled?: boolean;
	forceTextInputFocus?: boolean;
};

export type AppTextInputProps = Omit<NativeTextInputProps, "style"> & {
	label?: string;
	left?: ReactNode;
	right?: ReactNode;
	disabled?: boolean;
	error?: boolean;
	underlineStyle?: ViewStyle;
	textColor?: string;
	style?: ViewStyle | ViewStyle[];
};

const Container = styled.View<{ $error?: boolean; $disabled?: boolean }>`
	min-height: 52px;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	background-color: ${({theme}) => theme.inputBackground};
	border-radius: 12px;
	border: 1px solid ${({theme, $error}) => $error ? theme.danger : theme.border};
	padding: 6px 12px;
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
`;

const InputStack = styled.View`
	flex: 1;
	min-width: 0;
`;

const Label = styled.Text`
	color: ${({theme}) => theme.textMuted};
	font-size: 12px;
	font-weight: 600;
	margin-bottom: 2px;
`;

const StyledInput = styled(NativeTextInput)<{$multiline?: boolean}>`
	min-height: ${({$multiline}) => $multiline ? "86px" : "28px"};
	padding: 0;
	color: ${({theme}) => theme.text};
	font-size: 16px;
`;

const IconButton = styled.Pressable<{ $disabled?: boolean }>`
	min-width: 28px;
	min-height: 28px;
	align-items: center;
	justify-content: center;
	opacity: ${({$disabled}) => $disabled ? 0.45 : 1};
`;

export const TextInputIcon = ({icon, onPress, disabled}: TextInputIconProps) => (
	<IconButton onPress={onPress} disabled={disabled || !onPress} $disabled={disabled}>
		<Icon name={icon as any} size={22} />
	</IconButton>
);

const renderSlot = (slot: ReactNode) => {
	if (!slot)
		return null;

	return slot as ReactElement;
};

export const TextInput = ({
	label,
	left,
	right,
	disabled,
	editable,
	error,
	style,
	placeholderTextColor,
	multiline,
	...props
}: AppTextInputProps) => (
	<Container $error={error} $disabled={disabled} style={style}>
		{renderSlot(left)}
		<InputStack pointerEvents={disabled ? "none" : "auto"}>
			{label ? <Label>{label}</Label> : null}
			<StyledInput
				{...props}
				$multiline={multiline}
				multiline={multiline}
				editable={!disabled && editable !== false}
				placeholderTextColor={placeholderTextColor}
			/>
		</InputStack>
		{renderSlot(right)}
	</Container>
);
