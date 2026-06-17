import {action, makeObservable, observable} from "mobx";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";

type SnackbarAction = {
	label: string;
	onPress?: () => void;
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

	if (!visible)
		return null;

	return <SnackbarContainer>
		<SnackbarText>{title}</SnackbarText>
		{action.label ? (
			<SnackbarActionButton onPress={() => {
				action.onPress?.();
				hide();
			}}>
				<SnackbarActionText>{action.label}</SnackbarActionText>
			</SnackbarActionButton>
		) : null}
	</SnackbarContainer>;
});

export const showSnackbar = (title: string, action: SnackbarAction = EmptyAction) => {
	snackbar.show(title, action);
};

export const hideSnackbar = () => {
	snackbar.hide();
};

const SnackbarContainer = styled.View`
	position: absolute;
	left: 12px;
	right: 12px;
	bottom: 24px;
	min-height: 48px;
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 12px 14px;
	border-radius: 12px;
	background-color: ${({theme}) => theme.card};
	border: 1px solid ${({theme}) => theme.border};
`;

const SnackbarText = styled.Text`
	flex: 1;
	color: ${({theme}) => theme.text};
	font-size: 14px;
`;

const SnackbarActionButton = styled.Pressable`
	padding: 6px 8px;
`;

const SnackbarActionText = styled.Text`
	color: ${({theme}) => theme.primary};
	font-weight: 700;
`;
