import {Host, TextInput as ExpoTextInput, useNativeState} from "@expo/ui";
import {useEffect, useState, type ReactNode} from "react";
import {Platform, type KeyboardTypeOptions} from "react-native";
import Animated, {
	Easing,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import styled, {useTheme} from "styled-components/native";
import {TextInput} from "../styles/TextInput";

type NativeTextFieldProps = {
	disabled?: boolean;
	error?: boolean;
	keyboardType?: KeyboardTypeOptions;
	label?: string;
	left?: ReactNode;
	multiline?: boolean;
	numberOfLines?: number;
	onBlur?: () => void;
	onChangeText?: (value: string) => void;
	onFocus?: () => void;
	placeholder?: string;
	secureTextEntry?: boolean;
	value?: string;
};

export const NativeTextField = ({
	disabled,
	error,
	keyboardType,
	label,
	left,
	multiline,
	numberOfLines,
	onBlur,
	onChangeText,
	onFocus,
	placeholder,
	secureTextEntry,
	value = "",
}: NativeTextFieldProps) => {
	if (Platform.OS === "android") {
		return (
			<TextInput
				label={label}
				left={left}
				value={value}
				onChangeText={onChangeText}
				onBlur={onBlur}
				onFocus={onFocus}
				placeholder={placeholder}
				disabled={disabled}
				error={error}
				secureTextEntry={secureTextEntry}
				multiline={multiline}
				numberOfLines={numberOfLines}
				keyboardType={keyboardType}
			/>
		);
	}

	return (
		<ExpoNativeTextField
			disabled={disabled}
			error={error}
			keyboardType={keyboardType}
			label={label}
			left={left}
			multiline={multiline}
			numberOfLines={numberOfLines}
			onBlur={onBlur}
			onChangeText={onChangeText}
			onFocus={onFocus}
			placeholder={placeholder}
			secureTextEntry={secureTextEntry}
			value={value}
		/>
	);
};

const ExpoNativeTextField = ({
	disabled,
	error,
	keyboardType,
	label,
	left,
	multiline,
	numberOfLines,
	onBlur,
	onChangeText,
	onFocus,
	placeholder,
	secureTextEntry,
	value = "",
}: NativeTextFieldProps) => {
	const theme = useTheme();
	const nativeValue = useNativeState(value);
	const [isFocused, setIsFocused] = useState(false);
	const hasText = value.length > 0;
	const progress = useSharedValue(isFocused || hasText ? 1 : 0);

	useEffect(() => {
		if ("set" in nativeValue && typeof nativeValue.set === "function") {
			nativeValue.set(value);
		} else {
			nativeValue.value = value;
		}
	}, [nativeValue, value]);

	useEffect(() => {
		progress.set(withTiming(isFocused || hasText ? 1 : 0, {
			duration: 180,
			easing: Easing.out(Easing.cubic),
		}));
	}, [hasText, isFocused, progress]);

	const fieldStyle = useAnimatedStyle(() => ({
		borderBottomColor: error
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
		transform: [{translateY: interpolate(progress.get(), [0, 1], [2, 0])}],
	}));

	return (
		<Field $disabled={!!disabled} style={fieldStyle}>
			{left ? <Slot>{left}</Slot> : null}
			<InputStack>
				{label ? <Label style={labelStyle}>{label}</Label> : null}
				<NativeInputHost matchContents={false}>
					<ExpoTextInput
						value={nativeValue}
						onChangeText={onChangeText}
						onFocus={() => {
							setIsFocused(true);
							onFocus?.();
						}}
						onBlur={() => {
							setIsFocused(false);
							onBlur?.();
						}}
						placeholder={placeholder}
						editable={!disabled}
						keyboardType={keyboardType}
						multiline={multiline}
						numberOfLines={numberOfLines}
						secureTextEntry={secureTextEntry}
						placeholderTextColor={theme.textMuted}
						cursorColor={theme.primary}
						selectionColor={theme.primary}
						style={{
							height: multiline ? 86 : 28,
							width: "100%",
							padding: 0,
						}}
						textStyle={{
							color: theme.text,
							fontSize: 16,
						}}
					/>
				</NativeInputHost>
			</InputStack>
		</Field>
	);
};

const Field = styled(Animated.View)<{ $disabled: boolean }>`
	min-height: 44px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	border-bottom-width: 1px;
	padding: 4px 0;
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
`;

const Slot = styled.View`
	align-items: center;
	justify-content: center;
`;

const InputStack = styled.View`
	flex: 1;
	min-width: 0;
`;

const Label = styled(Animated.Text)`
	font-size: 12px;
	font-weight: 500;
	margin-bottom: 1px;
`;

const NativeInputHost = styled(Host)`
	min-height: 28px;
	width: 100%;
	justify-content: center;
`;
