import styled from "styled-components/native";
import {useIsFocused} from "@react-navigation/core";
import {View} from "react-native";
import {ReactNode} from "react";

export const BodyScroll = styled.ScrollView`
	flex: 1;
`;

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
