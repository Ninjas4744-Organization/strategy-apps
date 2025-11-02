import styled from "styled-components/native";
import {AppHeader} from "@ninjas-strategy/ui";

const Container = styled.SafeAreaView`
	padding: 50px 12px 12px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

export default function Index() {
	return (
		<Container>
			<AppHeader
				icon="sports-esports"
				title="The Ninja Trainee"
				description="Practice Performance Analytics" />
		</Container>
	);
}
