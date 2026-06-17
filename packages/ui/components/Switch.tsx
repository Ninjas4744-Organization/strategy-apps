import {useEffect} from "react";
import {
	Pressable,
	type PressableProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import styled, {useTheme} from "styled-components/native";

const SWITCH_WIDTH = 40;
const SWITCH_THUMB_SIZE = 20;
const SWITCH_HORIZONTAL_PADDING = 3;
const SWITCH_VERTICAL_PADDING = 3;
const SWITCH_HEIGHT = SWITCH_THUMB_SIZE + SWITCH_VERTICAL_PADDING * 2;
const SWITCH_MAX_OFFSET = SWITCH_WIDTH - SWITCH_THUMB_SIZE - SWITCH_HORIZONTAL_PADDING * 2;

export type SwitchProps = Omit<PressableProps, "disabled" | "onPress" | "style"> & {
	value?: boolean;
	disabled?: boolean;
	activeColor?: string;
	inactiveColor?: string;
	thumbColor?: string;
	style?: StyleProp<ViewStyle>;
	onValueChange?: (value: boolean) => void;
};

const Track = styled(Animated.View)<{ $disabled?: boolean }>`
	width: ${SWITCH_WIDTH}px;
	height: ${SWITCH_HEIGHT}px;
	padding: ${SWITCH_VERTICAL_PADDING}px ${SWITCH_HORIZONTAL_PADDING}px;
	border-radius: ${SWITCH_HEIGHT / 2}px;
	opacity: ${({$disabled}) => $disabled ? 0.52 : 1};
`;

const Thumb = styled(Animated.View)<{ $thumbColor: string }>`
	width: ${SWITCH_THUMB_SIZE}px;
	height: ${SWITCH_THUMB_SIZE}px;
	border-radius: ${SWITCH_THUMB_SIZE / 2}px;
	background-color: ${({$thumbColor}) => $thumbColor};
	shadow-color: #000000;
	shadow-opacity: 0.18;
	shadow-radius: 4px;
	shadow-offset: 0px 1px;
	elevation: 2;
`;

export function Switch({
	value = false,
	disabled,
	activeColor,
	inactiveColor,
	thumbColor,
	accessibilityLabel,
	style,
	onValueChange,
	...props
}: SwitchProps) {
	const theme = useTheme();
	const enabledColor = activeColor ?? theme.primary;
	const disabledColor = inactiveColor ?? theme.border;
	const resolvedThumbColor = thumbColor ?? theme.surface;
	const offset = useSharedValue(value ? SWITCH_MAX_OFFSET : 0);
	const isOn = useSharedValue(value);

	useEffect(() => {
		isOn.set(value);
		offset.set(
			withSpring(value ? SWITCH_MAX_OFFSET : 0, {
				damping: 100,
				stiffness: 1200,
			}),
		);
	}, [isOn, offset, value]);

	const thumbStyle = useAnimatedStyle(() => ({
		transform: [{translateX: offset.get()}],
	}));

	const trackStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			offset.get(),
			[0, SWITCH_MAX_OFFSET],
			[disabledColor, enabledColor],
		),
	}));

	function handlePress() {
		const nextValue = !isOn.get();

		isOn.set(nextValue);
		offset.set(
			withSpring(nextValue ? SWITCH_MAX_OFFSET : 0, {
				damping: 100,
				stiffness: 1200,
			}),
		);
		onValueChange?.(nextValue);
	}

	return (
		<Pressable
			{...props}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="switch"
			accessibilityState={{checked: value, disabled}}
			disabled={disabled}
			hitSlop={8}
			style={style}
			onPress={handlePress}>
			<Track $disabled={disabled} style={trackStyle}>
				<Thumb $thumbColor={resolvedThumbColor} style={thumbStyle}/>
			</Track>
		</Pressable>
	);
}
