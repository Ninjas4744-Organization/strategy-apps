import {action, makeObservable, observable} from "mobx";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Icon} from "./Icon";

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
	private timeout: ReturnType<typeof setTimeout> | null = null;

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
		if (this.timeout) {
			clearTimeout(this.timeout);
		}

		this.title = title;
		this.action = action;
		this.visible = true;
		this.timeout = setTimeout(() => this.hide(), action.label ? 5200 : 3600);
	}

	hide() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		this.visible = false;
	}
}

const snackbar = new SnackbarStore()

export const Snackbar = observer(() => {
	const {visible, hide, title, action} = snackbar;
	const insets = useSafeAreaInsets();

	if (!visible)
		return null;

	return (
		<SnackbarWrap pointerEvents="box-none" $top={Math.max(insets.top + 8, 14)}>
			<SnackbarContainer>
				<SnackbarIcon>
					<Icon name="notifications" size={19} />
				</SnackbarIcon>
				<SnackbarCopy>
					<SnackbarTitle numberOfLines={2}>{title}</SnackbarTitle>
				</SnackbarCopy>
				{action.label ? (
					<SnackbarActionButton onPress={() => {
						action.onPress?.();
						hide();
					}}>
						<SnackbarActionText>{action.label}</SnackbarActionText>
					</SnackbarActionButton>
				) : null}
				<SnackbarClose onPress={hide}>
					<Icon name="close" size={18} />
				</SnackbarClose>
			</SnackbarContainer>
		</SnackbarWrap>
	);
});

export const showSnackbar = (title: string, action: SnackbarAction = EmptyAction) => {
	snackbar.show(title, action);
};

export const hideSnackbar = () => {
	snackbar.hide();
};

const SnackbarWrap = styled.View<{ $top: number }>`
	position: absolute;
	left: 12px;
	right: 12px;
	top: ${({$top}) => $top}px;
	z-index: 80;
	align-items: center;
`;

const SnackbarContainer = styled.View`
	width: 100%;
	max-width: 520px;
	min-height: 58px;
	flex-direction: row;
	align-items: center;
	gap: 10px;
	padding: 9px 10px;
	border-radius: 14px;
	background-color: ${({theme}) => theme.card};
	border: 1px solid ${({theme}) => theme.border};
	shadow-color: #000000;
	shadow-opacity: 0.18;
	shadow-radius: 14px;
	shadow-offset: 0px 8px;
	elevation: 10;
`;

const SnackbarIcon = styled.View`
	width: 38px;
	height: 38px;
	border-radius: 19px;
	align-items: center;
	justify-content: center;
	background-color: ${({theme}) => `${theme.primary}22`};
	border: 1px solid ${({theme}) => `${theme.primary}55`};
`;

const SnackbarCopy = styled.View`
	flex: 1;
	min-width: 0;
`;

const SnackbarTitle = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 14px;
	font-weight: 700;
	line-height: 18px;
`;

const SnackbarActionButton = styled.Pressable`
	min-height: 34px;
	justify-content: center;
	border-radius: 17px;
	padding: 7px 10px;
	background-color: ${({theme}) => `${theme.primary}22`};
`;

const SnackbarActionText = styled.Text`
	color: ${({theme}) => theme.primary};
	font-size: 13px;
	font-weight: 800;
`;

const SnackbarClose = styled.Pressable`
	width: 32px;
	height: 32px;
	border-radius: 16px;
	align-items: center;
	justify-content: center;
	background-color: ${({theme}) => theme.inputBackground};
`;
