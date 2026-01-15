import styled, {css} from "styled-components/native";
import {TextSection, Title, Subtitle, Icon, iconContainerStyle} from "@ninjas-strategy/ui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {EdgeInsets} from "react-native-safe-area-context";
import {MD2Colors} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {Href, useRouter} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";
import {games} from "@ninjas-strategy/frc-games";
import {type Route} from "@react-navigation/native";
import gameStore from "@/lib/stores/gameStore";

type HeaderProps = {
	route: Route<string>;
};

type RouteParams = {
	eventId: string;
	pageNum: string;
};

const HeaderContainer = styled.View<{insets: EdgeInsets}>`
	padding-top: ${props => props.insets.top}px;
	margin: 12px;
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

const NextPageIconContainer = styled.TouchableOpacity`
	${iconContainerStyle};
`;

export const Header = observer(({route}: HeaderProps) => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const {eventId, pageNum} = route.params as RouteParams;
	const {teamNumber} = gameStore;
	const event = eventsStore.events[eventId];

	const page = parseInt(pageNum);
	const yearGame = games[event.year];

	return <HeaderContainer insets={insets}>
		{page > 0 && <PageIconContainer onPress={() => router.push(`/scouter/${eventId}/${parseInt(pageNum) - 1}` as Href)}>
			<PageIcon name="arrow-back"/>
		</PageIconContainer>}
		<TextSection>
			<Title>Now Scouting Team {teamNumber}</Title>
			<Subtitle>{event.name}</Subtitle>
		</TextSection>
		{page < yearGame.pages.length - 1 && <NextPageIconContainer onPress={() => router.push(`/scouter/${eventId}/${parseInt(pageNum) + 1}` as Href)}>
			<PageIcon name="arrow-forward"/>
		</NextPageIconContainer>}
	</HeaderContainer>;
});
