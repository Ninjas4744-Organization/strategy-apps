import styled, {css} from "styled-components/native";
import {TextSection, Title, Subtitle, Icon, iconContainerStyle} from "@ninjas-strategy/ui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {EdgeInsets} from "react-native-safe-area-context";
import {appColors} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import {Href, useRouter} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";
import {games} from "@ninjas-strategy/frc-games";
import {type Route} from "expo-router/react-navigation";
import gameStore from "@/lib/stores/gameStore";

type HeaderProps = {
	route: Route<string>;
};

type RouteParams = {
	eventId?: string | string[];
	pageNum?: string | string[];
	teamNum?: string | string[];
};

const HeaderContainer = styled.View<{insets: EdgeInsets}>`
	padding-top: ${props => Math.max(props.insets.top, 8)}px;
	margin: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const PageIcon = styled(Icon)`
	font-size: 24px;
	color: ${appColors.blue500};
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
	const {eventId: eventIdParam, pageNum: pageNumParam, teamNum: teamNumParam} = (route.params ?? {}) as RouteParams;
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const pageNum = Array.isArray(pageNumParam) ? pageNumParam[0] : pageNumParam;
	const teamNum = Array.isArray(teamNumParam) ? teamNumParam[0] : teamNumParam;
	const {teamNumber} = gameStore;
	const event = eventId ? eventsStore.events[eventId] : undefined;

	if (!event) {
		return <HeaderContainer insets={insets}>
			<TextSection>
				<Title>Loading event</Title>
			</TextSection>
		</HeaderContainer>;
	}

	const page = parseInt(pageNum ?? '0');
	const yearGame = games[event.year];

	return <HeaderContainer insets={insets}>
		{route.name === 'index' && <TextSection>
			<Title>{event.name}</Title>
			<Subtitle>{event.year}</Subtitle>
		</TextSection>}
		{route.name.startsWith('game') && <>
			{page > 0 && <PageIconContainer onPress={() => router.back()}>
				<PageIcon name="arrow-back"/>
			</PageIconContainer>}
			<TextSection>
				<Title>Now Scouting Team {teamNumber}</Title>
				<Subtitle>{event.name}</Subtitle>
			</TextSection>
			{yearGame && page < yearGame.pages.length - 1 && <NextPageIconContainer onPress={() => router.push(`/scouter/${eventId}/game/${page + 1}` as Href)}>
				<PageIcon name="arrow-forward"/>
			</NextPageIconContainer>}
		</>}
		{route.name.startsWith('pit') && <TextSection>
			<Title>Now Scouting Team {teamNum}</Title>
			<Subtitle>{event.name}</Subtitle>
		</TextSection>}
	</HeaderContainer>;
});
