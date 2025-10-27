import styled from "styled-components/native";
import {Subtitle} from "@/components/styles/Text";
import {MD2Colors, ProgressBar} from "react-native-paper";
import {Card, CardTitle} from "@/components/admin/Card";
import {Row} from "@/components/styles/FlexDir";
import {AdminTabProps} from "@/components/admin/commons";

export const Performance = ({team}: AdminTabProps) => {
	return <>
		<PerformanceCard label="Autonomous Performance" score={team.averageAutonomousScore} color={MD2Colors.orange500} />
		<PerformanceCard label="Teleop Performance" score={team.averageTeleopScore} color={MD2Colors.green500} />
		<PerformanceCard label="Algae Handling" score={team.averageAlgaeScore} color={MD2Colors.blue500} />
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
			<Subtitle>{score.toFixed(2)}%</Subtitle>
		</Row>
	</Card>;
};
