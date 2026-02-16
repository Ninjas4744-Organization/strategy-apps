import * as Updates from "expo-updates";
import styled from "styled-components/native";
import {AnimatedFAB, MD2Colors} from "react-native-paper";
import {Icon} from "@ninjas-strategy/ui";
import {useEffect} from "react";

const UpdateButton = styled(AnimatedFAB)`
	bottom: 16px;
	right: 16px;
	position: absolute;
	background-color: ${MD2Colors.red500};
`;

export const Updater = () => {
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
		<UpdateButton
			onPress={() => Updates.fetchUpdateAsync()}
			icon={() => <Icon name="system-update" />}
			label="Update app!"
			extended
			color={MD2Colors.white}/>
	);
}
