import styled from "styled-components/native";
import {CardSurface, Icon, Subtitle, TextSection, Title} from "@ninjas-strategy/ui";
import {IconContainer, iconContainerStyle} from "@ninjas-strategy/ui/styles/IconContainer";
import {MD2Colors} from "react-native-paper";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {Href, useGlobalSearchParams, useRouter} from "expo-router";

type SectionTitleProps = {
	title: string;
	subtitle: string;
	icon?: MaterialIcon;
	isFirstPage?: boolean;
	isLastPage?: boolean;
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

const PageIconContainer = styled.TouchableOpacity`
	${iconContainerStyle};
`;

export const SectionTitle = ({title, subtitle, icon, isFirstPage = false, isLastPage = false}: SectionTitleProps) => {
	const router = useRouter();
	const {eventId, pageNum} = useGlobalSearchParams();

	return <SectionTitleContainer>
		{!isFirstPage && <PageIconContainer onPress={() => router.push(`/scouter/${eventId}/${parseInt(pageNum as string) - 1}` as Href)}>
			<PageIcon name="arrow-back"/>
		</PageIconContainer>}
		{icon && <IconContainer>
			<PageIcon name={icon}/>
		</IconContainer>}
		<TextSection>
			<Title>{title}</Title>
			<Subtitle>{subtitle}</Subtitle>
		</TextSection>
		{!isLastPage && <PageIconContainer onPress={() => router.push(`/scouter/${eventId}/${parseInt(pageNum as string) + 1}` as Href)}>
			<PageIcon name="arrow-forward"/>
		</PageIconContainer>}
	</SectionTitleContainer>;
};
