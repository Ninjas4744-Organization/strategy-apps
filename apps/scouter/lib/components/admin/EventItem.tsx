import styled from "styled-components/native";
import {Subtitle, Title, Icon} from "@ninjas-strategy/ui";
import {useRouter} from "expo-router";
import {MD2Colors} from "react-native-paper";
import {useQuery} from "@tanstack/react-query";
import axios from 'axios';
import {useEventData} from "@/lib/hooks/tba";

type EventItemProps = {
	id: string,
	year: number,
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

export const EventItem = ({id, year}: EventItemProps) => {
	const {data: event, isPending, error} = useEventData(id);
	const router = useRouter();

	if (isPending)
		return null;

	return <EventItemContainer>
		<Details>
			<Title>{event?.data.name}</Title>
			<Subtitle>{year}</Subtitle>
		</Details>
		<NavigationButtons>
			<Icon name="chevron-right" onPress={() => router.push(`/admin/${id}`)}/>
		</NavigationButtons>
	</EventItemContainer>;
};
