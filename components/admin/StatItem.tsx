import styled from "styled-components/native";
import {Icon} from "../Icon";
import {Subtitle, Title} from "../styles/Text";
import {MaterialIcons} from "@expo/vector-icons";

type MaterialIcon = keyof typeof MaterialIcons.glyphMap;

type StatItemProps = {
	icon: MaterialIcon;
	value: string|number;
	title: string;
};

const StatItemContainer = styled.View`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`;

export const StatItem = ({icon, value, title}: StatItemProps) => {
	return <StatItemContainer>
		<Icon name={icon} />
		<Title>{value}</Title>
		<Subtitle>{title}</Subtitle>
	</StatItemContainer>
}

