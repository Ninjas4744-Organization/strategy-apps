import {AdminTabProps} from "../commons";
import {Breakdown} from "../analytics/Breakdown";
import {Card, CardTitle} from "../Card";
import {Subtitle, Title} from "../../styles/Text";
import {Col, Row} from "../../styles/FlexDir";
import styled from "styled-components/native";
import {Icon} from "../../Icon";
import {Colors} from "../../styles/colors";

export const OverviewTab = ({team}: AdminTabProps) => {
	return <>
		<Breakdown team={team}/>
		<PerformanceComparisonCard team={team}/>
		<CurrentStreak team={team} />
	</>;
}

const RedIcon = styled(Icon)`
	color: ${Colors.red};
	font-size: 32px;
`;

const GreenIcon = styled(Icon)`
	color: ${Colors.green};
	font-size: 32px;
`;

const RedText = styled.Text`
	color: ${Colors.red};
	font-size: 16px;
`;

const GreenText = styled.Text`
	color: ${Colors.green};
	font-size: 16px;
`;

const PerformanceComparisonCard = ({team}: AdminTabProps) => {
	const games = team.games;
	if (games.length < 6)
		return null;

	const recentGames = games.slice(0, 3);
	const olderGames = games.slice(games.length - 3);

	if (recentGames.length < 3 || olderGames.length < 3)
		return null;

	const recentAvg = recentGames.reduce((sum, game) => sum + game.totalScore, 0) / recentGames.length;

	const olderAvg = olderGames.reduce((sum, game) => sum + game.totalScore, 0) / olderGames.length;

	const improvement = recentAvg - olderAvg;

	const TextComponent = improvement > 0 ? GreenText : RedText;

	return <Card>
		<CardTitle>Recent vs Earlier Performance</CardTitle>
		<Row>
			<Col>
				<Subtitle>Recent {recentGames.length} games</Subtitle>
				<Title>{recentAvg.toFixed(2)}</Title>
			</Col>
			<Col>
				{improvement > 0 ? <GreenIcon name="trending-up" /> : <RedIcon name="trending-down" />}
				<TextComponent>{improvement > 0 && '+'}{improvement.toFixed(2)}</TextComponent>
			</Col>
			<Col>
				<Subtitle>Recent {olderGames.length} games</Subtitle>
				<Title>{olderAvg.toFixed(2)}</Title>
			</Col>
		</Row>
	</Card>;
}

const OrangeIcon = styled(Icon)`
	color: ${Colors.orange};
	font-size: 32px;
`;

const StreakDetails = styled(Col)`
	flex: 1;
	align-items: start;
`;

const CurrentStreak = ({team}: AdminTabProps) => {
	const streak = team.streakInfo;

	return <Card>
		<CardTitle>Current Streak</CardTitle>
		<Row>
			{streak.isPositive ? <OrangeIcon name="local-fire-department" /> : <RedIcon name="warning" />}
			<StreakDetails>
				<CardTitle>{streak.message}</CardTitle>
				<Subtitle>{streak.description}</Subtitle>
			</StreakDetails>
		</Row>
	</Card>
}
