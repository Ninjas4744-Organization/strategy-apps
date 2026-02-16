import {Col, Icon} from "@ninjas-strategy/ui";
import {Text} from "react-native-paper";
import * as Updates from 'expo-updates';
import styled from "styled-components/native";
import {openDialog} from "@ninjas-strategy/ui/components/AppDialog";
import {observer} from "mobx-react-lite";

const Button = styled.TouchableOpacity`
	padding: 8px;
	border-radius: 4px;
	width: 50px;
	height: 50px;
	justify-content: center;
	align-items: center;
`;

export const About = observer(() => {
	const show = () => {
		openDialog('About The Ninja Scouter', <AboutDialogContent />, 'info');
	};

	return (
		<Button onPress={show}>
			<Icon name="info" size={25} />
		</Button>
	);
});

const AboutDialogContent = () => (
	<Col>
		<Text variant="bodyLarge">The Ninja Scouter is an FRC scouting app developed by Ninjas 4744</Text>
		<Text variant="labelSmall">Version: {Updates.runtimeVersion}</Text>
		<Text variant="labelSmall">Channel: {Updates.channel}</Text>
	</Col>
);
