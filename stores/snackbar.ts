import {action, makeObservable, observable} from "mobx";
import type {$RemoveChildren} from "react-native-paper/lib/typescript/types";
import {Button} from "react-native-paper";

type SnackbarAction = $RemoveChildren<typeof Button> & {
	label: string;
};

const EmptyAction = {
	label: '',
};

class Snackbar {
	@observable visible = false;
	@observable title = '';
	@observable action: SnackbarAction = EmptyAction;

	constructor() {
		makeObservable(this);
	}

	@action
	show(title: string, action: SnackbarAction = EmptyAction) {
		this.title = title;
		this.action = action;
		this.visible = true;
	}

	@action.bound
	hide() {
		this.visible = false;
	}
}

const snackbar = new Snackbar();

export default snackbar;
