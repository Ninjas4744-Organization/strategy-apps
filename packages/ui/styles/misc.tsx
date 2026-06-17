import styled from "styled-components/native";
import {useIsFocused} from "expo-router/react-navigation";
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {ReactNode} from "react";

export const BodyScroll = styled.ScrollView`
	flex: 1;
`;

const BottomSafeAreaContainer = styled.View<{ $bottom: number }>`
	padding-bottom: ${({$bottom}) => Math.max($bottom, 16)}px;
`;

export const BottomSafeArea = ({children}: { children: ReactNode }) => {
	const insets = useSafeAreaInsets();

	return (
		<BottomSafeAreaContainer $bottom={insets.bottom}>
			{children}
		</BottomSafeAreaContainer>
	);
};

export const FocusWrapper = ({ children }: {children: ReactNode}) => {
	const focused = useIsFocused();
	return (
		<View
			style={{
				flex: 1,
				display: focused ? 'flex' : 'none'
			}}>
			{children}
		</View>
	);
};
