import {Snackbar as PaperSnackbar, Button} from 'react-native-paper';
import type {$RemoveChildren} from "react-native-paper/lib/typescript/types";
import {action, makeObservable, observable} from "mobx";
import {observer} from "mobx-react-lite";

type SnackbarAction = $RemoveChildren<typeof Button> & {
	label: string;
};

const EmptyAction = {
	label: '',
};

class SnackbarStore {
	visible = false;
	title = '';
	action: SnackbarAction = EmptyAction;

	constructor() {
		makeObservable(this, {
			visible: observable,
			title: observable,
			action: observable,
			show: action,
			hide: action.bound,
		});
	}

	show(title: string, action: SnackbarAction = EmptyAction) {
		this.title = title;
		this.action = action;
		this.visible = true;
	}

	hide() {
		this.visible = false;
	}
}

const snackbar = new SnackbarStore()

export const Snackbar = observer(() => {
	const {visible, hide, title, action} = snackbar;

	return (
		<PaperSnackbar
			visible={visible}
			onDismiss={hide}
			action={action}>
			{title}
		</PaperSnackbar>
	);
});

export const showSnackbar = (title: string, action: SnackbarAction = EmptyAction) => {
	snackbar.show(title, action);
};

export const hideSnackbar = () => {
	snackbar.hide();
};
