import styled from "styled-components/native";
import {MD2Colors} from "react-native-paper";

export const Card = styled.View`
	margin: 16px;
	padding: 16px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const CardTitle = styled.Text`
	color: ${MD2Colors.white};
	font-size: 18px;
	font-weight: bold;
`;
