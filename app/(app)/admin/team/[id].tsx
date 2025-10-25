import {Stack, useLocalSearchParams} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export default observer(function () {
	const {id} = useLocalSearchParams();
	return <Container>
		<Stack.Screen options={{ title: `Team ${id}` }} />
	</Container>;
});
