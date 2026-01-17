import styled from "styled-components/native";
import {Icon, Subtitle, Title} from "@ninjas-strategy/ui";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {MD2Colors} from "react-native-paper";

type StatItemProps = {
	icon: MaterialIcon;
	value: string|number;
	title: string;
	color?: string;
};

const StatItemContainer = styled.View`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`;

export const StatItem = ({icon, value, title, color = MD2Colors.white}: StatItemProps) => {
	return <StatItemContainer>
		<Icon name={icon} color={color} />
		<Title>{value}</Title>
		<Subtitle>{title}</Subtitle>
	</StatItemContainer>;
};

