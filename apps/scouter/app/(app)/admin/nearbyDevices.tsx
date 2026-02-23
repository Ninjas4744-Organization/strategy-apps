import {observer} from "mobx-react-lite";
import bleScannerStore from "@/lib/stores/bleScannerStore";
import {useEffect} from "react";
import styled from "styled-components/native";
import Animated, {LinearTransition} from "react-native-reanimated";
import {MD2Colors} from "react-native-paper";
import {NearbyDevice} from "@/lib/components/admin/NearbyDevice";

const Container = styled.View`
	flex: 1;
	padding: 16px;
`;

export default observer(function NearbyDevicesPage() {
	const {subscribe, unsubscribe, devices} = bleScannerStore;

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, []);

	return (
		<Container>
			<Animated.FlatList
				itemLayoutAnimation={LinearTransition}
				data={Object.keys(devices) as string[]}
				keyExtractor={(deviceId) => deviceId}
				renderItem={({item: deviceId}) => (
					<NearbyDevice {...devices[deviceId]} />
				)}/>
		</Container>
	);
});

const Card = styled.View`
	background-color: ${MD2Colors.white}08;
	padding: 20px;
	margin: 8px 0;
	border-radius: 16px;
	flex-direction: row;
	align-items: center;
	border: 1px solid ${MD2Colors.white}20;
`;
