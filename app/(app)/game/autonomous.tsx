import styled from "styled-components/native";
import {observer} from "mobx-react-lite";

const Container = styled.SafeAreaView`
	padding: 50px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

export default observer(function AutonomousPage() {
	return <Container>

	</Container>;
});
