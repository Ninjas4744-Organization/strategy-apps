import React, {Fragment, useContext, useEffect, useMemo, useState} from "react";
import {ScrollView} from "react-native";
import styled from "styled-components/native";
import {Card, CardSurface, FormDialog, Icon, Row, SimpleButton, Subtitle, Title} from "@ninjas-strategy/ui";
import {Stack, useLocalSearchParams} from "expo-router";
import {observer} from "mobx-react-lite";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import {games} from "@ninjas-strategy/frc-games";
import eventsStore from "@/lib/stores/eventsStore";
import {MD2Colors} from "react-native-paper";
import Animated, {LinearTransition} from "react-native-reanimated";

type AddTeamFormData = {
	team: string;
}

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const Cell = styled(CardSurface)`
	flex: 1;
	background-color: ${MD2Colors.lightBlue500}33;
	padding: 12px;
	border-radius: 14px;
	margin: 0 4px;
	justify-content: center;
	align-items: center;
`;

const Value = styled.Text<{ highlight?: boolean }>`
	color: ${({highlight}) => (highlight ? MD2Colors.lightGreen500 : MD2Colors.white)};
	font-size: 16px;
	font-weight: ${({highlight}) => (highlight ? "700" : "500")};
	text-align: center;
`;

const FlexGrow = styled.View`
	flex-grow: 1;
`;

export default observer(function CompareScreen() {
	const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
	const {eventId, id} = useLocalSearchParams<{ eventId: string, id: string }>();
	const [teamIds, setTeamIds] = useState<string[]>([id])
	const {teams} = useContext(EventContext) as EventStore;
	const comparisonTeams = useMemo(() => teamIds.map(id => teams[Number.parseInt(id as string)]).filter(t => t), [teamIds, teams]);

	const {events} = eventsStore;
	const game = games[events[eventId as string].year];

	const [shownSections, setShownSections] = useState<{[label: string]: boolean}>(() => game.mainPageSections.reduce((acc, section) => ({
		...acc,
		[section.title]: true,
	}), {}));

	const leaders = useMemo(() => {
		const leadingTeams: {[key: string]: number} = {};
		for (const section of game.mainPageSections) {
			for (const card of section.cards) {
				let leader: number | null = null;
				let currentMax = -Infinity;
				for (const team of comparisonTeams) {
					const value = card.numericVal(team);
					if (value > currentMax) {
						currentMax = value;
						leader = team.teamNumber;
					}
				}
				if (leader !== null) {
					leadingTeams[card.label] = leader;
				}
			}
		}
		return leadingTeams;
	}, [comparisonTeams, game]);

	useEffect(() => {
		comparisonTeams.forEach(team => team.subscribe());
		return () => comparisonTeams.forEach(team => team.unsubscribe());
	}, [comparisonTeams]);

	const addTeamToComparison = ({team}: AddTeamFormData) => {
		if (!teamIds.includes(team)) {
			setTeamIds(ids => [...ids, team]);
		}
		setShowAddTeamDialog(false);
	}

	return (
		<Container>
			<Stack.Screen
				options={{
					title: `Compare Teams`,
					headerRight: () => <SimpleButton onPress={() => setShowAddTeamDialog(true)}>
						<Icon name="add" />
						<Subtitle>&nbsp;Add Team&nbsp;</Subtitle>
					</SimpleButton>,
				}} />
			<Card>
				<Row>
					{comparisonTeams.map(team => (
						<Cell key={team.teamNumber}>
							<Title>{team.teamNumber}</Title>
						</Cell>
					))}
				</Row>
			</Card>
			<ScrollView>
				{game.mainPageSections.map((section, index) => (
					<Animated.View layout={LinearTransition} key={'section-' + index}>
						<Card>
							<Row>
								<Title>{section.title}</Title>
								<FlexGrow />
								<Icon name={shownSections[section.title] ? "arrow-downward" : "chevron-right"} onPress={() => setShownSections(s => ({...s, [section.title]: !s[section.title]}))} />
							</Row>
							{shownSections[section.title] && section.cards.map((card, itemIndex) => (
								<Fragment key={'section-' + index + '-item-' + itemIndex}>
									<Row>
										<Subtitle>{card.label}</Subtitle>
										<FlexGrow />
									</Row>
									<Row key={"section-" + index + "-item-" + itemIndex}>
										{comparisonTeams.map(team => (
											<Cell key={'team-' + team.teamNumber + '-card-' + itemIndex}>
												<Value highlight={leaders[card.label] === team.teamNumber}>{card.val(team)}</Value>
											</Cell>
										))}
									</Row>
								</Fragment>
							))}
						</Card>
					</Animated.View>
				))}
			</ScrollView>
			<FormDialog<AddTeamFormData>
				visible={showAddTeamDialog}
				onDismiss={() => (setShowAddTeamDialog(false))}
				title="Add Team To Comparison"
				onSubmit={addTeamToComparison}
				fields={[
					{
						name: "team",
						label: "Team",
						type: 'team',
						rules: {required: true},
						teams: events[eventId as string].teams,
					}
				]} />
		</Container>
	);
});
