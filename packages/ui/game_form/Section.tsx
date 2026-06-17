import type {ScoringSection} from "../../frc-games/types";
import {IconContainer, Title, Icon} from "../";
import styled from "styled-components/native";
import {GameField} from "./game_field";
import {observer} from "mobx-react-lite";

type SectionProps = ScoringSection & {
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
	pageNum: number;
};

const SectionContainer = styled.View<{ $color: string }>`
	margin: 16px;
	padding: 20px;
	background-color: ${({theme}) => theme.card};
	gap: 16px;
	border-radius: 16px;
	border-width: 1px;
	border-color: ${({$color}) => $color}66;
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

export const Section = observer(({color, icon, title, fields, data, setData, pageNum}: SectionProps) => {
	return <SectionContainer $color={color}>
		<SectionHeader>
			<IconContainer>
				<Icon name={icon} size={24} color={color} />
			</IconContainer>
			<Title>{title}</Title>
		</SectionHeader>
		{Object.entries(fields).map(([id, field]) => (
			<GameField key={id} {...field} id={id} data={data} setData={(key, value) => setData(key, value)} pageNum={pageNum} />
		))}
	</SectionContainer>;
});
