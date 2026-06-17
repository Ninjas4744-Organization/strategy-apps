import styled from "styled-components/native";
import type {MaterialIcon} from "@/interfaces/MaterialIcon";
import {Icon} from "./Icon";
import {BottomSheet} from "./BottomSheet";

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
	return <BottomSheet
		isPresented={visible}
		onDismiss={onDismiss}
		title={title}>
		{icon && <IconWrap><Icon name={icon} size={24} /></IconWrap>}
		<DialogContent>{content}</DialogContent>
		{actions && <DialogActions>
			{actions}
		</DialogActions>}
	</BottomSheet>;
};

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

const DialogContent = styled.View`
	gap: 12px;
`;

const DialogActions = styled.View`
	flex-direction: row;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 16px;
`;
