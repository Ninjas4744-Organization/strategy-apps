import {Animated, Easing} from "react-native";
import {useEffect, useRef} from "react";
import {AnimationProps} from "@/interfaces/AnimationProps";

export const Pulse = ({children, style}: AnimationProps) => {
	const pulseValue = useRef(new Animated.Value(1));

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseValue.current, {
					toValue: 1.2,
					duration: 2000,
					easing: Easing.ease,
					useNativeDriver: true,
				}),
				Animated.timing(pulseValue.current, {
					toValue: 1,
					duration: 2000,
					easing: Easing.ease,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	return <Animated.View
		style={{
			...style,
			transform: [{scale: pulseValue.current}],
		}}>
		{children}
	</Animated.View>;
};
