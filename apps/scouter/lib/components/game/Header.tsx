import styled, {css} from "styled-components/native";
import {TextSection, Title, Subtitle, Icon} from "@ninjas-strategy/ui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {EdgeInsets} from "react-native-safe-area-context";
import {MD2Colors} from "react-native-paper";
import {observer} from "mobx-react-lite";
import userStore from "@/lib/stores/userStore";
import {useLocalSearchParams} from "expo-router";
import eventsStore from "@/lib/stores/eventsStore";

const HeaderContainer = styled.View<{insets: EdgeInsets}>`
	padding-top: ${props => props.insets.top}px;
	margin: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const iconContainerStyle = css`
	background-color: ${MD2Colors.green500}20;
	border-radius: 16px;
	padding: 12px;
`;

const IconContainer = styled.View`
	${iconContainerStyle};
`;

const NextPageIconContainer = styled.TouchableOpacity`
	${iconContainerStyle};
`;

const AppBarIcon = styled(Icon)`
	font-size: 24px;
	color: ${MD2Colors.white};
`;

export const Header = observer(() => {
	const {signOut} = userStore;
	const insets = useSafeAreaInsets();
	const {eventId} = useLocalSearchParams();
	const event = eventsStore.events[eventId as string];

	return <HeaderContainer insets={insets}>
		<TextSection>
			<Title>{event.name}</Title>
			<Subtitle>{eventId}</Subtitle>
		</TextSection>
		<NextPageIconContainer onPress={() => signOut()}>
			<AppBarIcon name="logout" />
		</NextPageIconContainer>
	</HeaderContainer>;
});
