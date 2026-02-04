import {Dialog as PaperDialog} from 'react-native-paper';
import {ScrollView} from "react-native";

type DialogProps = {
	visible: boolean;
	onDismiss: () => void;
	title: string;
	content: React.ReactNode;
	actions?: React.ReactNode;
};

export const Dialog = ({visible, onDismiss, title, content, actions}: DialogProps) =>
{
	return <PaperDialog visible={visible} dismissable onDismiss={onDismiss}>
		<ScrollView>
			<PaperDialog.Title>{title}</PaperDialog.Title>
			<PaperDialog.Content>
				{content}
			</PaperDialog.Content>
			{actions && <PaperDialog.Actions>
				{actions}
			</PaperDialog.Actions>}
		</ScrollView>
	</PaperDialog>;
};
