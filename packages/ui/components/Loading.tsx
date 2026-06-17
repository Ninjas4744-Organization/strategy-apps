import styled from "styled-components/native";
import {ActivityIndicator} from "react-native";

const Container = styled.SafeAreaView`
	flex: 1;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
export const Loading = () => {
	return <Container>
		<ActivityIndicator size="large" />
	</Container>;
};
