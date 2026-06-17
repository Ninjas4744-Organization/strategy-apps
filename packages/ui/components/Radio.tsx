import {useEffect} from "react";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import styled, {useTheme} from "styled-components/native";

const RADIO_SIZE = 22;
const RADIO_DOT_SIZE = 10;

type RadioProps = {
	selected?: boolean;
	color?: string;
	inactiveColor?: string;
};

const Outer = styled(Animated.View)`
	width: ${RADIO_SIZE}px;
	height: ${RADIO_SIZE}px;
	border-radius: ${RADIO_SIZE / 2}px;
	border-width: 2px;
	align-items: center;
	justify-content: center;
`;

const Inner = styled(Animated.View)<{ $color: string }>`
	width: ${RADIO_DOT_SIZE}px;
	height: ${RADIO_DOT_SIZE}px;
	border-radius: ${RADIO_DOT_SIZE / 2}px;
	background-color: ${({$color}) => $color};
`;

export function Radio({selected = false, color, inactiveColor}: RadioProps) {
	const theme = useTheme();
	const activeColor = color ?? theme.primary;
	const idleColor = inactiveColor ?? theme.border;
	const progress = useSharedValue(selected ? 1 : 0);

	useEffect(() => {
		progress.set(withSpring(selected ? 1 : 0, {
			damping: 70,
			stiffness: 900,
		}));
	}, [progress, selected]);

	const outerStyle = useAnimatedStyle(() => ({
		borderColor: interpolateColor(progress.get(), [0, 1], [idleColor, activeColor]),
		backgroundColor: interpolateColor(progress.get(), [0, 1], ["transparent", `${activeColor}18`]),
		transform: [{
			scale: withTiming(selected ? 1 : 0.96, {duration: 120}),
		}],
	}));

	const innerStyle = useAnimatedStyle(() => ({
		opacity: progress.get(),
		transform: [{scale: progress.get()}],
	}));

	return (
		<Outer style={outerStyle}>
			<Inner $color={activeColor} style={innerStyle}/>
		</Outer>
	);
}
