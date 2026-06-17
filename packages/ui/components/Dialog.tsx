import {Modal, Pressable, ScrollView} from "react-native";
import styled from "styled-components/native";
import type {MaterialIcon} from "@/interfaces/MaterialIcon";
import {Icon} from "./Icon";

type DialogProps = {
	visible: boolean;
	onDismiss: () => void;
	icon?: MaterialIcon;
	title: string;
	content: React.ReactNode;
	actions?: React.ReactNode;
};

export const Dialog = ({visible, onDismiss, icon, title, content, actions}: DialogProps) =>
{
	return <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
		<Backdrop>
			<Pressable style={{position: "absolute", inset: 0 as any}} onPress={onDismiss} />
			<Panel>
				{icon && <IconWrap><Icon name={icon} size={24} /></IconWrap>}
				<DialogTitle>{title}</DialogTitle>
				<ScrollView>
					<DialogContent>{content}</DialogContent>
					{actions && <DialogActions>{actions}</DialogActions>}
				</ScrollView>
			</Panel>
		</Backdrop>
	</Modal>;
};

const Backdrop = styled.View`
	flex: 1;
	justify-content: center;
	padding: 18px;
	background-color: rgba(0, 0, 0, 0.42);
`;

const Panel = styled.View`
	max-height: 82%;
	border-radius: 16px;
	background-color: ${({theme}) => theme.card};
	border: 1px solid ${({theme}) => theme.border};
	padding: 18px;
`;

const IconWrap = styled.View`
	align-self: center;
	width: 44px;
	height: 44px;
	border-radius: 22px;
	align-items: center;
	justify-content: center;
	background-color: ${({theme}) => theme.inputBackground};
	margin-bottom: 8px;
`;

const DialogTitle = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 12px;
	text-align: center;
`;

const DialogContent = styled.View`
	gap: 12px;
`;

const DialogActions = styled.View`
	flex-direction: row;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 16px;
`;
