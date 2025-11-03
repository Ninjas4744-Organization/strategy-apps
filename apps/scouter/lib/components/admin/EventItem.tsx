import styled from "styled-components/native";
import {Subtitle, Title, Icon} from "@ninjas-strategy/ui";
import {useRouter} from "expo-router";
import {MD2Colors} from "react-native-paper";

type EventItemProps = {
	id: string;
	name: string;
	year: number;
	startDate: string;
	endDate: string;
};

const EventItemContainer = styled.View`
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

export const EventItem = ({id, name, year, startDate, endDate}: EventItemProps) => {
	const router = useRouter();

	return <EventItemContainer>
		<Details>
			<Title>{name}</Title>
			<Subtitle>{year}</Subtitle>
			<Subtitle>{startDate} → {endDate}</Subtitle>
		</Details>
		<NavigationButtons>
			<Icon name="chevron-right" onPress={() => router.push(`/admin/${id}`)}/>
		</NavigationButtons>
	</EventItemContainer>;
};
