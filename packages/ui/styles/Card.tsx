import styled from "styled-components/native";
import {CardSurface} from "./CardSurface";
import {Text} from './Text';

export const Card = styled(CardSurface)`
	margin: 16px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const CardTitle = styled(Text)`
	font-weight: bold;
`;
