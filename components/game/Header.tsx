import styled, {css} from "styled-components/native";
import {TextSection, Title, Subtitle} from "../styles/Text";
import {Icon} from "../Icon";
import {useAuth} from "../../lib/context/auth";
import {usePathname} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {EdgeInsets} from "react-native-safe-area-context";

const HeaderContainer = styled.View<{insets: EdgeInsets}>`
	padding-top: ${props => props.insets.top}px;
	margin: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

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

const iconContainerStyle = css`
	background-color: #4CAF5020;
	border-radius: 16px;
	padding: 12px;
`;

const IconContainer = styled.View`
	${iconContainerStyle};
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

const AppBarIcon = styled(Icon)`
	font-size: 24px;
	color: #eee;
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
