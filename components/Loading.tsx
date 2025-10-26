import styled from "styled-components/native";
import {ActivityIndicator, MD2Colors} from "react-native-paper";

const Container = styled.SafeAreaView`
	flex: 1;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
export const Loading = () => {
	return <Container>
		<ActivityIndicator size="large" color={MD2Colors.white} />
	</Container>;
};
