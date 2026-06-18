import {observer} from "mobx-react-lite";
import {Card, CardSurface, FormDialog, Row, IconContainer, Icon, Title, FlexGrow, Subtitle, showSnackbar} from "@ninjas-strategy/ui";
import {useEffect, useState} from "react";
import gameStore, {MAX_QUALIFICATION_MATCH_NUMBER} from "@/lib/stores/gameStore";
import eventsStore from "@/lib/stores/eventsStore";
import {Href, useGlobalSearchParams, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import {games} from "@ninjas-strategy/frc-games";
import pitStore from "@/lib/stores/pitStore";
import assignmentsStore from "@/lib/stores/assignmentsStore";
import styled from "styled-components/native";

type GameInputFormData = {
	teamNumber: string | number;
	gameNumber: string | number;
};

type PitInputFormData = {
	teamNumber: string | number;
}

const normalizeNumberInput = (value: string | number) => Number(String(value).trim());

const isEventTeam = (teamNumber: number, teams: string[]) => teams.includes(`frc${teamNumber}`);

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;

export default observer(function ScouterIndex() {
	const router = useRouter();
	const {eventId: eventIdParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const {startGame} = gameStore;
	const {startPit} = pitStore;
	const [showGameDialog, setShowGameDialog] = useState<boolean>(false);
	const [showPitDialog, setShowPitDialog] = useState<boolean>(false);

	const event = eventId ? eventsStore.events[eventId] : undefined;

	useEffect(() => {
		if (!eventId || eventId === 'undefined') {
			return;
		}

		assignmentsStore.subscribeForScouter(eventId);
		return () => assignmentsStore.unsubscribe();
	}, [eventId]);

	const scoutGame = (data: GameInputFormData) => {
		if (!eventId || eventId === 'undefined' || !event)
			return;

		const teamNumber = normalizeNumberInput(data.teamNumber);
		const gameNumber = normalizeNumberInput(data.gameNumber);
		if (!isPositiveInteger(teamNumber) || !isEventTeam(teamNumber, event.teams)) {
			showSnackbar('Choose a valid team from this event.');
			return;
		}
		if (!isPositiveInteger(gameNumber) || gameNumber > MAX_QUALIFICATION_MATCH_NUMBER) {
			showSnackbar('Enter a valid qualification match number.');
			return;
		}

		startGame(teamNumber.toString(), gameNumber.toString(), event.year);
		setShowGameDialog(false);
		router.push(`/scouter/${eventId}/game/0`);
	};

	const scoutAssignedGame = (teamNumber: string, gameNumber: string) => {
		if (!eventId || eventId === 'undefined' || !event || !gameNumber)
			return;

		startGame(teamNumber, gameNumber, event.year);
		router.push(`/scouter/${eventId}/game/0`);
	};

	const scoutPit = (data: PitInputFormData) => {
		if (!eventId || eventId === 'undefined' || !event)
			return;

		const teamNumber = normalizeNumberInput(data.teamNumber);
		if (!isPositiveInteger(teamNumber) || !isEventTeam(teamNumber, event.teams)) {
			showSnackbar('Choose a valid team from this event.');
			return;
		}

		setShowPitDialog(false);
		startPit(event.year);
		router.push(`/scouter/${eventId}/pit/${teamNumber}` as Href);
	};

	return <>
		{assignmentsStore.assignmentsList.length > 0 && (
			<AssignmentsSection>
				<Title>Your Assigned Games</Title>
				{assignmentsStore.assignmentsList.map(assignment => (
					<TouchableOpacity
						key={assignment.id}
						onPress={() => scoutAssignedGame(assignment.teamNumber, assignment.matchNumber)}>
						<AssignmentCard>
							<Row>
								<IconContainer>
									<Icon name="assignment" size={28} />
								</IconContainer>
								<AssignmentText>
									<Title>{assignment.matchTitle}</Title>
									<Subtitle>Team {assignment.teamNumber}</Subtitle>
								</AssignmentText>
								<FlexGrow />
								<Icon name="chevron-right" size={24} />
							</Row>
						</AssignmentCard>
					</TouchableOpacity>
				))}
			</AssignmentsSection>
		)}
		<TouchableOpacity onPress={() => setShowGameDialog(true)}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="sports-esports" size={32} />
					</IconContainer>
					<Title>Game Scouting</Title>
					<FlexGrow />
					<Icon name="chevron-right" size={24} />
				</Row>
			</Card>
		</TouchableOpacity>
		{event && games[event.year]?.pitScoutingAttributes && <TouchableOpacity onPress={() => setShowPitDialog(true)}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="checklist" size={32}/>
					</IconContainer>
					<Title>Pit Scouting</Title>
					<FlexGrow/>
					<Icon name="chevron-right" size={24}/>
				</Row>
			</Card>
		</TouchableOpacity>}
		<FormDialog<GameInputFormData>
			visible={showGameDialog}
			onDismiss={() => setShowGameDialog(false)}
			title={`Scout a game`}
			onSubmit={scoutGame}
			fields={[
				{
					name: "teamNumber",
					label: "Team Number",
					type: 'team',
					rules: {
						required: 'Choose a team.',
						validate: value => {
							const teamNumber = normalizeNumberInput(value);
							return isPositiveInteger(teamNumber) && isEventTeam(teamNumber, event?.teams ?? []) ? true : 'Choose a valid team from this event.';
						},
					},
					teams: event?.teams || [],
				},
				{
					name: "gameNumber",
					label: 'Game Number',
					type: 'number',
					iconLeft: 'sports-esports',
					rules: {
						required: 'Enter a match number.',
						validate: value => {
							const gameNumber = normalizeNumberInput(value);
							return isPositiveInteger(gameNumber) && gameNumber <= MAX_QUALIFICATION_MATCH_NUMBER ? true : 'Enter a valid qualification match number.';
						},
					},
				}
			]} />
		<FormDialog<PitInputFormData>
			visible={showPitDialog}
			onDismiss={() => setShowPitDialog(false)}
			title="Scout a team"
			onSubmit={scoutPit}
			fields={[
				{
					name: "teamNumber",
					label: "Team Number",
					type: 'team',
					rules: {
						required: 'Choose a team.',
						validate: value => {
							const teamNumber = normalizeNumberInput(value);
							return isPositiveInteger(teamNumber) && isEventTeam(teamNumber, event?.teams ?? []) ? true : 'Choose a valid team from this event.';
						},
					},
					teams: event?.teams || [],
				},
			]} />
	</>;
});

const AssignmentsSection = styled.View`
	margin: 8px 0;
`;

const AssignmentCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 16px;
`;

const AssignmentText = styled.View`
	flex-shrink: 1;
	gap: 4px;
`;
