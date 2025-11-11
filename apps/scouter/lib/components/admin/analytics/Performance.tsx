import styled from "styled-components/native";
import {MD2Colors, ProgressBar} from "react-native-paper";
import {Card, CardTitle, Row, Subtitle} from "@ninjas-strategy/ui";
import {AdminTabProps} from "@/lib/components/admin/commons";

export const Performance = ({team}: AdminTabProps) => {
	return <>
		{team.game.performance.map((performance, index) => (
			<PerformanceCard
				key={'performance-' + team.id + '-' + index}
				label={performance.label}
				score={performance.val(team)}
				color={performance.color} />
		))}
	</>;
};

type PerformanceCardProps = {
	label: string,
	score: number,
	color: string,
}

const ProgressContainer = styled.View`
	flex: 1;
`;

const PerformanceCard = ({label, score, color}: PerformanceCardProps) => {
	return <Card>
		<CardTitle>{label}</CardTitle>
		<Row>
			<ProgressContainer>
				<ProgressBar progress={score / 100} color={color} />
			</ProgressContainer>
			<Subtitle>{score.toFixed(1)}%</Subtitle>
		</Row>
	</Card>;
};
