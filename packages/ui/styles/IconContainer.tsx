import styled, {css} from "styled-components/native";

export const iconContainerStyle = css`
	background-color: ${({theme}) => theme.inputBackground};
	border: 1px solid ${({theme}) => theme.border};
	border-radius: 16px;
	padding: 12px;
`;

export const IconContainer = styled.View`
	${iconContainerStyle};
`;
