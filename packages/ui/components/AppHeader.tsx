import styled from "styled-components/native";
import {Pulse} from "@/animations/pulse";
import {Text} from "@/styles/Text";
import {IconContainer} from "@/styles/IconContainer";
import {Icon} from "@/components/Icon";
import {MD2Colors} from "react-native-paper";
import type {MaterialIcon} from "@/interfaces/MaterialIcon";

type AppHeaderProps = {
	icon: MaterialIcon;
	title: string;
	description: string;
};

const HeaderContainer = styled(Pulse)`
	padding: 16px;
	gap: 12px;
	justify-content: center;
	align-items: center;
`;

const Title = styled(Text)`
	font-size: 24px;
	font-weight: bold;
`;

const Description = styled(Text)`
	font-size: 14px;
	opacity: 0.8;
`;

export const AppHeader = ({icon, title, description}: AppHeaderProps) => {
	return (
		<HeaderContainer>
			<IconContainer>
				<Icon color={MD2Colors.grey500} name={icon} size={36}/>
			</IconContainer>
			<Title>{title}</Title>
			<Description>{description}</Description>
		</HeaderContainer>
	);
}
