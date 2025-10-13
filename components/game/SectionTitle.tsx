import styled, {css} from "styled-components/native";
import {Icon} from "../Icon";
import {Subtitle, TextSection, Title} from "../styles/Text";
import {MaterialIcons} from '@expo/vector-icons';
import {IconContainer, iconContainerStyle} from "../styles/IconContainer";

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
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const PageIcon = styled(Icon)`
	font-size: 24px;
	color: #2196F3;
`;

const NextPageIconContainer = styled.TouchableOpacity`
	${iconContainerStyle};
`;

const NextPageIcon = styled(Icon)`
	font-size: 24px;
	color: #4CAF50;
`;

export const SectionTitle = ({title, subtitle, iconRight, iconLeft, onLeftClick}: SectionTitleProps) =>
{
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
	</SectionTitleContainer>
}
