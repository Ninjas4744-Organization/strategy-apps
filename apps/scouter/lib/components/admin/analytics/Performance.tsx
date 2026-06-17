import styled from "styled-components/native";
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
	height: 8px;
	border-radius: 4px;
	background-color: ${({theme}) => theme.inputBackground};
	overflow: hidden;
`;

const ProgressFill = styled.View<{ $progress: number; $color: string }>`
	width: ${({$progress}) => `${Math.max(0, Math.min(1, $progress)) * 100}%`};
	height: 100%;
	background-color: ${({$color}) => $color};
`;

const PerformanceCard = ({label, score, color}: PerformanceCardProps) => {
	return <Card>
		<CardTitle>{label}</CardTitle>
		<Row>
			<ProgressContainer>
				<ProgressFill $progress={score / 100} $color={color} />
			</ProgressContainer>
			<Subtitle>{score.toFixed(1)}%</Subtitle>
		</Row>
	</Card>;
};
