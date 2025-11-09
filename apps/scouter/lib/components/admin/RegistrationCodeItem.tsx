import styled from "styled-components/native";
import {Subtitle, Title, Icon, showSnackbar} from "@ninjas-strategy/ui";
import {deleteDoc, doc} from 'firebase/firestore';
import {db} from "@/lib/firebase/firestore";
import * as Clipboard from "expo-clipboard";
import {MD2Colors} from "react-native-paper";
import {TouchableOpacity} from "react-native";

type RegistrationCodeItemProps = {
	id: string;
	membersCode: string;
	adminsCode: string;
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

export const RegistrationCodeItem = ({id, membersCode, adminsCode}: RegistrationCodeItemProps) => {
	const removeItem = async () => {
		await deleteDoc(doc(db, 'registration_codes', id));
	};

	return (
		<Card>
			<Details>
				<Title>{id}</Title>

				<CopyButton onPress={() => Clipboard.setStringAsync(membersCode).then(() => showSnackbar(`Members registration code for ${id} copied to clipboard!`))}>
					<Subtitle>👥 Members:</Subtitle>
					<Subtitle>{membersCode}</Subtitle>
					<Icon name="content-copy" size={16} />
				</CopyButton>

				<CopyButton onPress={() => Clipboard.setStringAsync(adminsCode).then(() => showSnackbar(`Admin registration code for ${id} copied to clipboard!`))}>
					<Subtitle>🛠 Admins:</Subtitle>
					<Subtitle>{adminsCode}</Subtitle>
					<Icon name="content-copy" size={16} />
				</CopyButton>
			</Details>

			<ActionRow>
				<Icon name="delete-outline" size={28} color={MD2Colors.red400} onPress={removeItem} />
			</ActionRow>
		</Card>
	);
};
