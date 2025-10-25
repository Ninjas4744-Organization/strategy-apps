import styled from "styled-components/native";
import {ActivityIndicator} from "react-native-paper";
import {Colors} from "./styles/colors";

const Container = styled.SafeAreaView`
	flex: 1;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
export const Loading = () => {
	return <Container>
		<ActivityIndicator size="large" color={Colors.white} />
	</Container>;
};
