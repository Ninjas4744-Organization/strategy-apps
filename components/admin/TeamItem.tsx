import styled from "styled-components/native";
import {Subtitle, Title} from "../styles/Text";
import {Colors} from "../styles/colors";
import {Game} from "../../models/Game";
import {Icon} from "../Icon";
import {useRouter} from "expo-router";

type TeamItemProps = {
	index: number,
	teamNumber: number,
	games: Game[],
	averageTotalScore: string,
};

const TeamItemContainer = styled.View`
	margin: 8px;
	padding: 20px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const getRankColor = (rank: number) => {
	switch (rank) {
		case 1:
			return Colors.amber;
		case 2:
			return Colors.silver;
		case 3:
			return Colors.bronze;
		default:
			return Colors.blue;
	}
}

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
