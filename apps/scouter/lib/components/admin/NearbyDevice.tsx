import styled from "styled-components/native";
import {Subtitle, Title, Icon, showSnackbar} from "@ninjas-strategy/ui";
import * as Clipboard from "expo-clipboard";
import {MD2Colors} from "react-native-paper";
import {TouchableOpacity} from "react-native";

type NearbyDeviceProps = {
	shortId: number;
	status: string;
	teamNumber: number;
	matchNumber: number;
	rssi?: number;
	lastSeen: number;
};

const Card = styled.View`
	background-color: ${MD2Colors.white}08;
	padding: 20px;
	margin: 8px 0;
	border-radius: 16px;
	flex-direction: row;
	align-items: center;
	border: 1px solid ${MD2Colors.white}20;
`;

const Details = styled.View`
	flex: 1;
	gap: 6px;
`;

const ActionRow = styled.View`
	flex-direction: row;
	gap: 20px;
`;

const CopyButton = styled(TouchableOpacity)`
	flex-direction: row;
	align-items: center;
	gap: 4px;
`;

export const NearbyDevice = ({shortId, status, teamNumber, matchNumber}: NearbyDeviceProps) => {
	return (
		<Card>
			<Details>
				<Title>{shortId}</Title>
				<Subtitle>Currently scouting {teamNumber}</Subtitle>
				{matchNumber > 0 ? <Subtitle>Match: {matchNumber}</Subtitle> : <Subtitle>Currently pit scouting</Subtitle>}
				<Subtitle>Status: {status}</Subtitle>
				<Subtitle>Last seen: {new Date().toLocaleTimeString()}</Subtitle>
			</Details>

			<ActionRow>
				<Icon name="notification-add" size={28} color={MD2Colors.red800} />
			</ActionRow>
		</Card>
	);
};
