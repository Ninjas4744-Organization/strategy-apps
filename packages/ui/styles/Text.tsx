import styled, {css} from "styled-components/native";
import {MD2Colors} from "react-native-paper";

export const TextStyle = css`
	color: ${MD2Colors.white};
	font-size: 18px;
`;

export const Text = styled.Text`
	${TextStyle};
`;

export const TextSection = styled.View`
	padding: 16px;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const Title = styled(Text)`
	font-size: 24px;
	font-weight: bold;
`;

export const Subtitle = styled(Text)`
	font-size: 14px;
`;
