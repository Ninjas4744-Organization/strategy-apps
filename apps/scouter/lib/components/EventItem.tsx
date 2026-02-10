import styled from "styled-components/native";
import {Subtitle, Title, Icon, CardSurface} from "@ninjas-strategy/ui";
import {flag} from 'country-emoji';
import {TouchableOpacity} from "react-native";

type EventItemProps = {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	country: string;
	onClick: () => void;
};

const EventItemContainer = styled(CardSurface)`
	margin: 8px;
	padding: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const Details = styled.View`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const NavigationButtons = styled.View`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const EventItem = ({id, name, startDate, endDate, country, onClick}: EventItemProps) => {
	return <TouchableOpacity onPress={onClick}>
		<EventItemContainer>
			<Details>
				<Title>{flag(country)} {name}</Title>
				<Subtitle>{id}</Subtitle>
				<Subtitle>{startDate} → {endDate}</Subtitle>
			</Details>
			<NavigationButtons>
				<Icon name="chevron-right"/>
			</NavigationButtons>
		</EventItemContainer>
	</TouchableOpacity>;
};
