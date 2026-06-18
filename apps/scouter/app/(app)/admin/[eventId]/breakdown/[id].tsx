import {Href, Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {Subtitle, Title, Row, Icon, SimpleButton, CardSurface} from "@ninjas-strategy/ui";
import {Insight} from "@/lib/interfaces/Insight";
import {Tabs} from "@/lib/components/admin/Tabs";
import {OverviewTab} from "@/lib/components/admin/team/OverviewTab";
import {GamesList} from "@/lib/components/admin/team/GamesList";
import {ScoreTrend} from "@/lib/components/admin/analytics/ScoreTrend";
import {AnalysisTab} from "@/lib/components/admin/team/AnalysisTab";
import {appColors} from "@ninjas-strategy/ui";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const PageHeader = styled(CardSurface)`
	margin: 8px;
	padding: 16px 10px;
	display: flex;
	flex-direction: column;
`;

const AmberIcon = styled(Icon)`
	color: ${appColors.amber500};
`;

const OrangeIcon = styled(Icon)`
	color: ${appColors.orange500};
`;

const GreenIcon = styled(Icon)`
	color: ${appColors.green500};
`;

export default observer(function () {
	const {eventId, id} = useGlobalSearchParams();
	const router = useRouter();
	const {teams} = useContext(EventContext) as EventStore;
	const team = teams[Number.parseInt(id as string)];

	return <Container>
		<Stack.Screen
			options={{
				title: `Team ${id}`,
				headerRight: () => (
					<SimpleButton onPress={() => router.push(`/admin/${eventId}/detailed/${id}` as Href)}>
						<Icon name="analytics" />
						<Subtitle>Detailed View</Subtitle>
					</SimpleButton>
				)
			}} />
		<PageHeader>
			<Title><AmberIcon name="lightbulb" /> Performance Insights</Title>
			{team.insights.map((insight, index) => (
				<PerformanceInsight key={`${id}-inside-${index}`} {...insight} />
			))}
		</PageHeader>
		<Tabs
			tabs={{
				overview: {
					label: 'Overview',
					render: <OverviewTab team={team}/>,
				},
				games: {
					label: 'Games',
					render: <GamesList team={team}/>,
				},
				trends: {
					label: 'Trends',
					render: <ScoreTrend team={team}/>,
				},
				analysis: {
					label: 'Analysis',
					render: <AnalysisTab team={team}/>,
				},
			}} />
	</Container>;
});

const PerformanceInsight = ({message, isPositive}: Insight) => {
	return <Row>
		{isPositive ? <GreenIcon name="trending-up"/> : <OrangeIcon name="trending-down"/>}
		<Subtitle>{message}</Subtitle>
	</Row>;
};
