import * as Updates from "expo-updates";
import styled from "styled-components/native";
import {AnimatedFAB, MD2Colors} from "react-native-paper";
import {Icon, showSnackbar} from "@ninjas-strategy/ui";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {observer} from "mobx-react-lite";

const UpdateButton = styled(AnimatedFAB)`
	bottom: 16px;
	right: 16px;
	position: absolute;
	background-color: ${MD2Colors.red500};
`;

export const Updater = observer(() => {
	const {isUpdateAvailable, isUpdatePending} = Updates.useUpdates();

	useEffect(() => {
		showUpdatedMessage();
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

	const showUpdatedMessage = async () => {
		const currentVersion = await AsyncStorage.getItem('currentVersion');
		if (currentVersion && currentVersion !== Updates.runtimeVersion) {
			showSnackbar('App updated to version ' + Updates.runtimeVersion);
			await AsyncStorage.setItem('currentVersion', Updates.runtimeVersion ?? '');
		}
	}

	if (!isUpdateAvailable) {
		return null;
	}

	return (
		<UpdateButton
			onPress={() => Updates.fetchUpdateAsync()}
			icon={() => <Icon name="system-update" />}
			label="Update app!"
			extended
			color={MD2Colors.white}/>
	);
});
