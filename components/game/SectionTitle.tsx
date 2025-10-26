import styled from "styled-components/native";
import {Icon} from "../Icon";
import {Subtitle, TextSection, Title} from "../styles/Text";
import {MaterialIcons} from '@expo/vector-icons';
import {IconContainer, iconContainerStyle} from "../styles/IconContainer";
import {MD2Colors} from "react-native-paper";

type MaterialIcon = keyof typeof MaterialIcons.glyphMap;


type SectionTitleProps = {
	title: string;
	subtitle: string;
	iconLeft?: MaterialIcon;
	iconRight?: MaterialIcon;
	onLeftClick?: () => void;
};

const SectionTitleContainer = styled.View`
	margin: 16px;
	padding: 20px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
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
