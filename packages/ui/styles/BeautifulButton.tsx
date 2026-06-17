import styled from "styled-components/native";
import {Icon} from "../";
import {Text} from "./Text";
import type {MaterialIcon} from "../interfaces/MaterialIcon";

type BeautifulButtonProps = {
	label: string;
	icon: MaterialIcon;
	onPress: () => void;
};

const Button = styled.TouchableOpacity`
	height: 48px;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 12px;
	border-radius: 12px;
	margin: 8px;
	background-color: ${({theme}) => theme.primary};
	border: 1px solid ${({theme}) => theme.primary};
`;

const ButtonText = styled(Text)`
	color: ${({theme}) => theme.primaryText};
	font-size: 16px;
	font-weight: 600;
`;

export const BeautifulButton = ({label, icon, onPress}: BeautifulButtonProps) => (
	<Button onPress={onPress}>
		<Icon color="#ffffff" name={icon} size={16} />
		<ButtonText>{label}</ButtonText>
	</Button>
);
