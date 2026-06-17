import styled from "styled-components/native";
import {Subtitle} from "../../..";

export const BoolField = ({label, value, onChange}: {label: string; value: boolean; onChange: (value: boolean) => void}) => {
	return (
		<Row onPress={() => onChange(!value)} $active={value}>
			<Box $active={value} />
			<Subtitle>{label}</Subtitle>
		</Row>
	);
}

const Row = styled.Pressable<{ $active: boolean }>`
	min-height: 48px;
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 8px 10px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${({theme, $active}) => $active ? theme.primary : theme.border};
	background-color: ${({theme, $active}) => $active ? `${theme.primary}20` : "transparent"};
`;

const Box = styled.View<{ $active: boolean }>`
	width: 22px;
	height: 22px;
	border-radius: 6px;
	border-width: 2px;
	border-color: ${({theme}) => theme.primary};
	background-color: ${({theme, $active}) => $active ? theme.primary : "transparent"};
`;
