import {useEffect, useRef} from "react";
import styled from "styled-components/native";
import {Animated} from "react-native";
import type {ViewStyle} from "react-native";
import {appColors} from "../styles/theme";

const useSkeletonAnimation = () => {
	const opacity = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
				Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
			])
		).start();
	}, [opacity]);

	return opacity;
};

const BaseSkeleton = styled(Animated.View)<{ width?: string | number; height?: string | number; radius?: number }>`
  background-color: ${appColors.grey600}40;
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width || "100%")};
  height: ${({ height }) => (typeof height === "number" ? `${height}px` : height || "16px")};
  border-radius: ${({ radius }) => radius ?? 8}px;
`;

export const SkeletonLine = ({ width = "100%", height = 16, style }: { width?: string | number; height?: number; style?: ViewStyle }) => {
	const opacity = useSkeletonAnimation();
	return <BaseSkeleton style={[{ opacity }, style]} width={width} height={height} />;
};

export const SkeletonCircle = ({ size = 40, style }: { size?: number; style?: ViewStyle }) => {
	const opacity = useSkeletonAnimation();
	return <BaseSkeleton style={[{ opacity }, style]} width={size} height={size} radius={size / 2} />;
};

export const SkeletonBox = ({ width = "100%", height = 80, radius = 12, style }: { width?: string | number; height?: number; radius?: number; style?: ViewStyle }) => {
	const opacity = useSkeletonAnimation();
	return <BaseSkeleton style={[{ opacity }, style]} width={width} height={height} radius={radius} />;
};
