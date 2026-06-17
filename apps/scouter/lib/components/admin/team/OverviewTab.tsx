import {AdminTabProps} from "@/lib/components/admin/commons";
import {Breakdown} from "@/lib/components/admin/analytics/Breakdown";
import {Card, CardTitle, Subtitle, Title, Col, Row, Icon} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {appColors} from "@ninjas-strategy/ui";

export const OverviewTab = ({team}: AdminTabProps) => {
	return <>
		<Breakdown team={team}/>
		<PerformanceComparisonCard team={team}/>
		<CurrentStreak team={team} />
	</>;
};

const RedIcon = styled(Icon)`
	color: ${appColors.red500};
	font-size: 32px;
`;

const GreenIcon = styled(Icon)`
	color: ${appColors.green500};
	font-size: 32px;
`;

const RedText = styled.Text`
	color: ${appColors.red500};
	font-size: 16px;
`;

const GreenText = styled.Text`
	color: ${appColors.green500};
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
				<Title>{recentAvg.toFixed(1)}</Title>
			</Col>
			<Col>
				{improvement > 0 ? <GreenIcon name="trending-up" /> : <RedIcon name="trending-down" />}
				<TextComponent>{improvement > 0 && '+'}{improvement.toFixed(1)}</TextComponent>
			</Col>
			<Col>
				<Subtitle>Recent {olderGames.length} games</Subtitle>
				<Title>{olderAvg.toFixed(1)}</Title>
			</Col>
		</Row>
	</Card>;
};

const OrangeIcon = styled(Icon)`
	color: ${appColors.orange500};
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
	</Card>;
};
