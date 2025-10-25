import {Team} from "../../../models/Team";
import styled from "styled-components/native";
import {Subtitle, Title} from "../../styles/Text";
import {ProgressBar} from "react-native-paper";
import {ChartWrapper} from "../ChartWrapper";
import {Colors} from "../../styles/colors";
import {Row} from "../../styles/Row";

type PerformanceProps = {
	team: Team;
};
export const Performance = ({team}: PerformanceProps) => {
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
	return <ChartWrapper>
		<Title>{label}</Title>
		<Row>
			<ProgressContainer>
				<ProgressBar progress={score / 100} color={color} />
			</ProgressContainer>
			<Subtitle>{score.toFixed(2)}%</Subtitle>
		</Row>
	</ChartWrapper>;
}
