import styled from "styled-components/native";
import {Subtitle} from "../../styles/Text";
import {ProgressBar} from "react-native-paper";
import {Card, CardTitle} from "../Card";
import {Colors} from "../../styles/colors";
import {Row} from "../../styles/FlexDir";
import {AdminTabProps} from "../commons";

export const Performance = ({team}: AdminTabProps) => {
	return <>
		<PerformanceCard label="Autonomous Performance" score={team.averageAutonomousScore} color={Colors.orange} />
		<PerformanceCard label="Teleop Performance" score={team.averageTeleopScore} color={Colors.green} />
		<PerformanceCard label="Algae Handling" score={team.averageAlgaeScore} color={Colors.blue} />
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
