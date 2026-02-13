import {Dialog as PaperDialog, MD2Colors, MD3Colors} from 'react-native-paper';
import {ScrollView} from "react-native";
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
	return <PaperDialog visible={visible} dismissable onDismiss={onDismiss}>
		{icon && <PaperDialog.Icon icon={() => <Icon name={icon} color={MD3Colors.secondary50} size={24} />} />}
		<PaperDialog.Title>{title}</PaperDialog.Title>
		<ScrollView>
			<PaperDialog.Content>
				{content}
			</PaperDialog.Content>
			{actions && <PaperDialog.Actions>
				{actions}
			</PaperDialog.Actions>}
		</ScrollView>
	</PaperDialog>;
};
