import styled from "styled-components/native";
import {Colors} from "../styles/colors";

export const Card = styled.View`
	margin: 16px;
	padding: 20px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const CardTitle = styled.Text`
	color: ${Colors.white};
	font-size: 18px;
	font-weight: bold;
`;
