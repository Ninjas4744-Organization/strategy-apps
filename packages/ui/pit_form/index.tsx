import type {FRCGame} from "@ninjas-strategy/frc-games/types";
import {observer} from "mobx-react-lite";
import {PitField} from "./pit_field";
import styled from "styled-components/native";

type PitFormProps = FRCGame & {
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

const FormContainer = styled.View<{ color: string }>`
	margin: 16px;
	padding: 20px;
	background-color: ${props => props.color}20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

export const PitForm = observer(({data, setData, pitScoutingAttributes}: PitFormProps) => {
	return <FormContainer>
		{Object.entries(pitScoutingAttributes || {}).map(([key, attribute]) => (
			<PitField {...attribute} key={key} data={data} setData={setData} />
		))}
	</FormContainer>;
});
