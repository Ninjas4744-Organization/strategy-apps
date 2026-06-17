import {action, makeObservable, observable} from "mobx";
import {Dialog} from "./Dialog";
import {observer} from "mobx-react-lite";
import type {MaterialIcon} from "@/interfaces/MaterialIcon.ts";

class DialogStore {
	visible: boolean = false;
	icon: MaterialIcon | undefined = undefined;
	title: string = ''
	content: React.ReactNode = null;
	buttons: React.ReactNode = null;

	constructor() {
		makeObservable(this, {
			visible: observable,
			icon: observable,
			title: observable,
			content: observable,
			buttons: observable,
			open: action,
			close: action.bound,
		});
	}

	open(title: string, content: React.ReactNode, icon?: MaterialIcon, buttons: React.ReactNode = null) {
		this.icon = icon;
		this.title = title;
		this.content = content;
		this.buttons = buttons;
		this.visible = true;
	}

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
