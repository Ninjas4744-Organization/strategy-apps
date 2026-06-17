import styled, {useTheme} from "styled-components/native";
import {
	TextInput as NativeTextInput,
	type TextInputProps as NativeTextInputProps,
	type ViewStyle,
} from "react-native";
import {useEffect, useState, type ReactElement, type ReactNode} from "react";
import Animated, {
	Easing,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
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

const Container = styled(Animated.View)<{ $disabled?: boolean }>`
	min-height: 56px;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	background-color: ${({theme}) => theme.inputBackground};
	border-radius: 12px;
	border-width: 1px;
	padding: 7px 12px;
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
`;

const InputStack = styled.View`
	flex: 1;
	min-width: 0;
	justify-content: center;
`;

const Label = styled(Animated.Text)`
	position: absolute;
	left: 0;
	top: 4px;
	z-index: 1;
	font-size: 12px;
	font-weight: 600;
`;

const StyledInput = styled(NativeTextInput)<{$hasLabel: boolean; $multiline?: boolean}>`
	min-height: ${({$multiline}) => $multiline ? "86px" : "28px"};
	padding: ${({$hasLabel, $multiline}) => {
		if (!$hasLabel) return "0";
		return $multiline ? "18px 0 0" : "16px 0 0";
	}};
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
	onBlur,
	onChangeText,
	onFocus,
	value,
	defaultValue,
	...props
}: AppTextInputProps) => {
	const theme = useTheme();
	const [isFocused, setIsFocused] = useState(false);
	const [hasText, setHasText] = useState(() => Boolean(value ?? defaultValue));
	const progress = useSharedValue(isFocused || hasText ? 1 : 0);

	useEffect(() => {
		if (value !== undefined) {
			setHasText(String(value).length > 0);
		}
	}, [value]);

	useEffect(() => {
		progress.set(withTiming(isFocused || hasText ? 1 : 0, {
			duration: 180,
			easing: Easing.out(Easing.cubic),
		}));
	}, [hasText, isFocused, progress]);

	const containerStyle = useAnimatedStyle(() => ({
		borderColor: error
			? theme.danger
			: interpolateColor(
				progress.get(),
				[0, 1],
				[theme.border, isFocused ? theme.primary : theme.border],
			),
	}));

	const labelStyle = useAnimatedStyle(() => ({
		color: error
			? theme.danger
			: interpolateColor(
				progress.get(),
				[0, 1],
				[theme.textMuted, isFocused ? theme.primary : theme.textMuted],
			),
		opacity: interpolate(progress.get(), [0, 1], [0.82, 1]),
		transform: [
			{translateY: interpolate(progress.get(), [0, 1], [6, 0])},
			{scale: interpolate(progress.get(), [0, 1], [0.98, 1])},
		],
	}));

	return (
		<Container $disabled={disabled} style={[containerStyle, style]}>
			{renderSlot(left)}
			<InputStack pointerEvents={disabled ? "none" : "auto"}>
				{label ? <Label style={labelStyle}>{label}</Label> : null}
				<StyledInput
					{...props}
					$hasLabel={!!label}
					$multiline={multiline}
					multiline={multiline}
					editable={!disabled && editable !== false}
					placeholderTextColor={placeholderTextColor}
					value={value}
					defaultValue={defaultValue}
					onFocus={(event) => {
						setIsFocused(true);
						onFocus?.(event);
					}}
					onBlur={(event) => {
						setIsFocused(false);
						onBlur?.(event);
					}}
					onChangeText={(text) => {
						setHasText(text.length > 0);
						onChangeText?.(text);
					}}
				/>
			</InputStack>
			{renderSlot(right)}
		</Container>
	);
};
