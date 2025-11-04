import styled from "styled-components/native";
import {CardSurface, Icon, Subtitle, TextSection, Title} from "@ninjas-strategy/ui";
import {IconContainer, iconContainerStyle} from "@ninjas-strategy/ui/styles/IconContainer";
import {MD2Colors} from "react-native-paper";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

type SectionTitleProps = {
	title: string;
	subtitle: string;
	iconLeft?: MaterialIcon;
	iconRight?: MaterialIcon;
	onLeftClick?: () => void;
};

const SectionTitleContainer = styled(CardSurface)`
	margin: 16px;
	padding: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const PageIcon = styled(Icon)`
	font-size: 24px;
	color: ${MD2Colors.blue500};
`;

const NextPageIconContainer = styled.TouchableOpacity`
	${iconContainerStyle};
`;

const NextPageIcon = styled(Icon)`
	font-size: 24px;
	color: ${MD2Colors.green500};
`;

export const SectionTitle = ({title, subtitle, iconRight, iconLeft, onLeftClick}: SectionTitleProps) => {
	return <SectionTitleContainer>
		{iconLeft && <IconContainer>
			<PageIcon name={iconLeft}/>
		</IconContainer>}
		<TextSection>
			<Title>{title}</Title>
			<Subtitle>{subtitle}</Subtitle>
		</TextSection>
		{iconRight && <NextPageIconContainer onPress={onLeftClick}>
			<NextPageIcon name={iconRight}/>
		</NextPageIconContainer>}
	</SectionTitleContainer>;
};
