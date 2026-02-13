import {action, makeObservable, observable} from "mobx";
import {Dialog} from "./Dialog";
import {observer} from "mobx-react-lite";
import type {MaterialIcon} from "@/interfaces/MaterialIcon.ts";

class DialogStore {
	@observable visible: boolean = false;
	@observable icon?: MaterialIcon;
	@observable title: string = ''
	@observable content: React.ReactNode = null;
	@observable buttons: React.ReactNode = null;

	constructor() {
		makeObservable(this);
	}

	@action
	open(title: string, content: React.ReactNode, icon?: MaterialIcon, buttons: React.ReactNode = null) {
		this.icon = icon;
		this.title = title;
		this.content = content;
		this.buttons = buttons;
		this.visible = true;
	}

	@action.bound
	close() {
		this.visible = false;
	}
}

const dialog = new DialogStore();

export const AppDialog = observer(() => {
	const {visible, icon, title, content, buttons, close} = dialog;
	return <Dialog visible={visible} onDismiss={close} icon={icon} title={title} content={content} actions={buttons} />;
});

export const openDialog = (title: string, content: React.ReactNode, icon?: MaterialIcon, buttons: React.ReactNode = null) => {
	dialog.open(title, content, icon, buttons);
}

export const closeDialog = () => {
	dialog.close();
}
