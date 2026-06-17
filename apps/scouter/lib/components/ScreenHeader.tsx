import {ReactNode} from "react";
import styled from "styled-components/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {MD2Colors} from "react-native-paper";
import {Title} from "@ninjas-strategy/ui";

type ScreenHeaderProps = {
	title: string;
	right?: ReactNode;
};

const Container = styled(SafeAreaView).attrs({
	edges: ['top'],
})`
	background-color: ${MD2Colors.indigo900};
`;

const Content = styled.View`
	min-height: 56px;
	justify-content: center;
	align-items: center;
	padding: 0 64px;
`;

const HeaderTitle = styled(Title)`
	font-size: 20px;
`;

const Right = styled.View`
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	justify-content: center;
`;

export const ScreenHeader = ({title, right}: ScreenHeaderProps) => (
	<Container>
		<Content>
			<HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
			{right && <Right>{right}</Right>}
		</Content>
	</Container>
);
