import styled from "styled-components/native";
import {CardSurface, Icon, Subtitle, TextSection, Title} from "@ninjas-strategy/ui";
import {IconContainer} from "@ninjas-strategy/ui/styles/IconContainer";
import {MD2Colors} from "react-native-paper";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

type SectionTitleProps = {
	title: string;
	subtitle: string;
	icon?: MaterialIcon;
};

const Container = styled(CardSurface)`
	margin: 16px;
	padding: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const PageIcon = styled(Icon)`
	font-size: 24px;
	color: ${MD2Colors.green500};
`;

export const PageTitle = ({title, subtitle, icon}: SectionTitleProps) => {
	return <Container>
		{icon && <IconContainer>
			<PageIcon name={icon}/>
		</IconContainer>}
		<TextSection>
			<Title>{title}</Title>
			<Subtitle>{subtitle}</Subtitle>
		</TextSection>
	</Container>;
};
