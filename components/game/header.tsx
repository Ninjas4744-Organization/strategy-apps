import styled, {css} from "styled-components/native";
import {Text} from "../styles/Text";
import {Icon} from "../Icon";

type HeaderProps = {
	name: string;
	showAutoEndDialog: () => void;
}

const HeaderContainer = styled.View`
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

const TextSection = styled.View`
	padding: 16px;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const Title = styled(Text)`
	font-size: 24px;
	font-weight: bold;
`;

const Subtitle = styled(Text)`
	font-size: 14px;
`;

export const Header = ({name, showAutoEndDialog}: HeaderProps) => {
	const isAuto = name === 'autonomous';

	return <>
		<HeaderContainer>
			<IconContainer>
				<PageIcon name={isAuto ? 'adb' : 'gamepad'} />
			</IconContainer>
			<TextSection>
				<Title>{isAuto ? 'Autonomous phase' : 'Teleop phase'}</Title>
				<Subtitle>{isAuto ? 'Full auto control' : 'Drivers control'}</Subtitle>
			</TextSection>
			{isAuto && <NextPageIconContainer onPress={() => showAutoEndDialog()}>
				<NextPageIcon name="arrow-forward" />
			</NextPageIconContainer>}
		</HeaderContainer>
	</>;
};
