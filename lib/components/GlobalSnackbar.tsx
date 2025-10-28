import {Snackbar} from 'react-native-paper';
import {observer} from "mobx-react-lite";
import snackbar from "@/lib/stores/snackbar";

export const GlobalSnackbar = observer(() => {
	const {visible, hide, title, action} = snackbar;

	return (
		<Snackbar
			visible={visible}
			onDismiss={hide}
			action={action}>
			{title}
		</Snackbar>
	);
});
