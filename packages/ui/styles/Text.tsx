import styled, {css} from "styled-components/native";

export const TextStyle = css`
	color: ${({theme}) => theme.text};
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
	color: ${({theme}) => theme.textMuted};
`;
