import styled from "styled-components/native";

export const CardSurface = styled.View`
	background-color: ${({theme}) => theme.card};
	gap: 16px;
	border: 1px solid ${({theme}) => theme.border};
	border-radius: 16px;
`;
