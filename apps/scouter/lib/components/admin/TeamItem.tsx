import styled from "styled-components/native";
import {Subtitle, Title} from "@/lib/components/styles/Text";
import {Game} from "@/lib/models/Game";
import {Icon} from "@/lib/components/Icon";
import {useRouter} from "expo-router";
import {MD2Colors} from "react-native-paper";

type TeamItemProps = {
	index: number,
	teamNumber: number,
	games: Game[],
	averageTotalScore: string,
};

const TeamItemContainer = styled.View`
	margin: 8px;
	padding: 20px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const getRankColor = (rank: number) => {
	switch (rank) {
		case 1:
			return MD2Colors.amber500;
		case 2:
			return MD2Colors.grey400;
		case 3:
			return MD2Colors.brown300;
		default:
			return MD2Colors.blue500;
	}
};

const Rank = styled.View<{color: string}>`
	height: 40px;
	width: 40px;
	border-radius: 8px;
	background-color: ${props => props.color};
	justify-content: center;
	align-items: center;
`;

const Details = styled.View`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const NavigationButtons = styled.View`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const TeamItem = ({index, teamNumber, games, averageTotalScore}: TeamItemProps) => {
	const router = useRouter();

	return <TeamItemContainer>
		<Rank color={getRankColor(index + 1)}>
			<Title>{index + 1}</Title>
		</Rank>
		<Details>
			<Title>{teamNumber}</Title>
			<Subtitle>{`${games.length} games • Avg: ${averageTotalScore} points`}</Subtitle>
		</Details>
		<NavigationButtons>
			<Icon name="analytics" onPress={() => router.push(`/admin/analytics/${teamNumber}`)}/>
			<Icon
				name="chevron-right"
				onPress={() => router.push(`/admin/team/${teamNumber}`)}/>
		</NavigationButtons>
	</TeamItemContainer>;
};
