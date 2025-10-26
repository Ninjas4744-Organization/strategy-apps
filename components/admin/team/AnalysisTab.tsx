import {AdminTabProps} from "../commons";
import {Card, CardTitle} from "../Card";
import {Col, Row} from "../../styles/FlexDir";
import styled from "styled-components/native";
import {Icon} from "../../Icon";
import {Subtitle} from "../../styles/Text";
import {MD2Colors} from "react-native-paper";

export const AnalysisTab = ({team}: AdminTabProps) => {
	return <>
		<StrengthsWeaknessesCard team={team}/>
		<StrategicRecommendations team={team}/>
	</>;
};

const GreenIcon = styled(Icon)`
	color: ${MD2Colors.green500};
	font-size: 20px;
`;

const GreenText = styled.Text`
	color: ${MD2Colors.green500};
	font-size: 16px;
	font-weight: bold;
`;

const RedIcon = styled(Icon)`
	color: ${MD2Colors.red500};
	font-size: 20px;
`;

const RedText = styled.Text`
	color: ${MD2Colors.red500};
	font-size: 16px;
	font-weight: bold;
`;

const ColStart = styled.View`
	flex-direction: column;
	align-items: start;
	gap: 8px;
`;

const StrengthsWeaknessesCard = ({team}: AdminTabProps) => {
	return <Card>
		<CardTitle>Strengths & Weaknesses</CardTitle>
		<Row>
			<Col>
				<Row>
					<GreenIcon name="thumb-up" />
					<GreenText>Strengths</GreenText>
				</Row>
				<ColStart>
					{team.strenghts.map((strength, index) => <Subtitle key={"strength-" + index}>
						* {strength}
					</Subtitle>)}
				</ColStart>
			</Col>
			<Col>
				<Row>
					<RedIcon name="thumb-down" />
					<RedText>Weaknesses</RedText>
				</Row>
				<ColStart>
					{team.weaknesses.map((weakness, index) => <Subtitle key={"weekness-" + index}>
						* {weakness}
					</Subtitle>)}
				</ColStart>
			</Col>
		</Row>
	</Card>;
};

const BlueTitleIcon = styled(Icon)`
	color: ${MD2Colors.blue500};
	font-size: 20px;
`;

const AmberIcon = styled(Icon)`
	color: ${MD2Colors.amber500};
	font-size: 16px;
`;

const Recommendation = styled.View`
	flex-direction: row;
`;

const StrategicRecommendations = ({team}: AdminTabProps) => {
	return <Card>
		<Row>
			<BlueTitleIcon name="recommend" />
			<CardTitle>Strategic Recommendations</CardTitle>
		</Row>
		<ColStart>
			{team.recommendations.map((recommendation, index) => <Recommendation key={"recommendation-" + index}>
				<AmberIcon name="lightbulb-outline" />
				<Subtitle>&nbsp;{recommendation}</Subtitle>
			</Recommendation>)}
		</ColStart>
	</Card>;
};
