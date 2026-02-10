import styled from "styled-components/native";
import {Subtitle, Title, Icon, CardSurface} from "@ninjas-strategy/ui";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {MD2Colors} from "react-native-paper";
import {Team} from "@/lib/models/Team";
import {observer} from "mobx-react-lite";
import {TeamItemSkeleton} from "@/lib/components/admin/TeamItemSkeleton";
import {TouchableOpacity} from "react-native";

type TeamItemProps = {
	index: number,
	team: Team;
	averageTotalScore: string,
};

const TeamItemContainer = styled(CardSurface)`
	margin: 8px;
	padding: 20px;
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

export const TeamItem = observer(({index, team, averageTotalScore}: TeamItemProps) => {
	const {eventId} = useGlobalSearchParams();
	const router = useRouter();
	const {teamNumber, games, isLoading} = team;

	if (isLoading)
		return <TeamItemSkeleton />;

	return (
		<TouchableOpacity onPress={() => router.push(`/admin/${eventId}/team/${teamNumber}`)}>
			<TeamItemContainer>
				<Rank color={getRankColor(index + 1)}>
					<Title>{index + 1}</Title>
				</Rank>
				<Details>
					<Title>{teamNumber}</Title>
					<Subtitle>{`${games.length} games • Avg: ${averageTotalScore} points`}</Subtitle>
				</Details>
				<NavigationButtons>
					<Icon name="chevron-right" />
				</NavigationButtons>
			</TeamItemContainer>
		</TouchableOpacity>
	);
});
