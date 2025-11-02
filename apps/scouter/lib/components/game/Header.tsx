import styled, {css} from "styled-components/native";
import {TextSection, Title, Subtitle, Icon} from "@ninjas-strategy/ui";
import {useAuth} from "@/lib/context/auth";
import {usePathname} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {EdgeInsets} from "react-native-safe-area-context";
import {MD2Colors} from "react-native-paper";

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

export const Header = () => {
	const {signOut} = useAuth();
	const pathname = usePathname();
	const isAuto = pathname.endsWith('autonomous');
	const insets = useSafeAreaInsets();

	return <HeaderContainer insets={insets}>
		<IconContainer>
			<AppBarIcon name="sports-esports" />
		</IconContainer>
		<TextSection>
			<Title>FRC Scouting App</Title>
			<Subtitle>{isAuto ? 'Autonomous Phase' : 'Teleop Phase'}</Subtitle>
		</TextSection>
		<NextPageIconContainer onPress={() => signOut()}>
			<AppBarIcon name="logout" />
		</NextPageIconContainer>
	</HeaderContainer>;
};
