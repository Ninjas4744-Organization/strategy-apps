import type {ScoringSection} from "@ninjas-strategy/frc-games/Game.ts";
import {IconContainer, Title, Icon} from "../";
import styled from "styled-components/native";
import {GameField} from "./game_field";
import {observer} from "mobx-react-lite";

type SectionProps = ScoringSection & {
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

const SectionContainer = styled.View<{ color: string }>`
	margin: 16px;
	padding: 20px;
	background-color: ${props => props.color}20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const SectionHeader = styled.View`
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const Section = observer(({color, icon, title, fields, data, setData}: SectionProps) => {
	return <SectionContainer color={color}>
		<SectionHeader>
			<IconContainer>
				<Icon name={icon} size={24} color={color} />
			</IconContainer>
			<Title>{title}</Title>
		</SectionHeader>
		{Object.entries(fields).map(([id, field]) => (
			<GameField key={id} {...field} id={id} data={data} setData={(key, value) => setData(key, value)} />
		))}
	</SectionContainer>;
});
