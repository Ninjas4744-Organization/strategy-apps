import * as Updates from "expo-updates";
import styled from "styled-components/native";
import {Icon} from "@ninjas-strategy/ui";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";

const UpdateButton = styled.Pressable`
	bottom: 16px;
	right: 16px;
	position: absolute;
	min-height: 48px;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	padding: 12px 14px;
	border-radius: 24px;
	background-color: ${({theme}) => theme.danger};
`;

const UpdateText = styled.Text`
	color: ${({theme}) => theme.primaryText};
	font-weight: 700;
`;

export const Updater = observer(() => {
	const {isUpdateAvailable, isUpdatePending} = Updates.useUpdates();

	useEffect(() => {
		const interval = setInterval(() => {
			Updates.checkForUpdateAsync();
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (isUpdatePending) {
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

	if (!isUpdateAvailable) {
		return null;
	}

	return (
		<UpdateButton onPress={() => Updates.fetchUpdateAsync()}>
			<Icon name="system-update" color="#ffffff" />
			<UpdateText>Update app!</UpdateText>
		</UpdateButton>
	);
});
