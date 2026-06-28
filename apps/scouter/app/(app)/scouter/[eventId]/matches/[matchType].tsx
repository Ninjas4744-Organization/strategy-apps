import {observer} from "mobx-react-lite";
import {useCallback, useState} from "react";
import {ScrollView, TouchableOpacity} from "react-native";
import {useFocusEffect, useGlobalSearchParams, useRouter} from "expo-router";
import {Card, CardSurface, FlexGrow, FormDialog, Icon, IconContainer, Loading, Row, Subtitle, Title, showSnackbar} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import gameStore, {MAX_QUALIFICATION_MATCH_NUMBER} from "@/lib/stores/gameStore";
import eventsStore from "@/lib/stores/eventsStore";
import eventActiveUsersStore from "@/lib/stores/eventActiveUsersStore";
import eventMatchesStore from "@/lib/stores/eventMatchesStore";
import userStore from "@/lib/stores/userStore";
import {type EventMatch, type EventMatchStatus} from "@/lib/models/EventMatch";

type MatchType = "qualification" | "practice";

type ManualGameInputFormData = {
	teamNumber: string | number;
	gameNumber: string | number;
};

const scrollContentStyle = {paddingBottom: 24};

const normalizeNumberInput = (value: string | number) => Number(String(value).trim());

const isEventTeam = (teamNumber: number, teams: string[]) => teams.includes(`frc${teamNumber}`);

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;

export default observer(function ScouterMatchSelector() {
	const router = useRouter();
	const [showManualDialog, setShowManualDialog] = useState(false);
	const {eventId: eventIdParam, matchType: matchTypeParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const matchTypeParamString = Array.isArray(matchTypeParam) ? matchTypeParam[0] : matchTypeParam;
	const matchType: MatchType = matchTypeParamString === "practice" ? "practice" : "qualification";
	const event = eventId ? eventsStore.events[eventId] : undefined;
	const matches = matchType === "practice" ? eventMatchesStore.practiceMatchesList : eventMatchesStore.qualificationMatchesList;
	const visibleMatches = matches.filter(match => match.status !== "finished");
	const canSubmitReports = !!userStore.user?.isAnonymous || (event?.active !== false && eventActiveUsersStore.isCurrentUserActive);

	useFocusEffect(useCallback(() => {
		if (!eventId || eventId === "undefined") {
			return;
		}

		eventActiveUsersStore.subscribeForEvent(eventId);
		eventMatchesStore.subscribeForEvent(eventId);
		return () => {
			eventActiveUsersStore.unsubscribe();
			eventMatchesStore.unsubscribe();
		};
	}, [eventId]));

	const showReportsUnavailable = () => {
		if (event?.active === false) {
			showSnackbar("This event is closed for new reports.");
			return;
		}

		if (!eventActiveUsersStore.isCurrentUserActive && !userStore.user?.isAnonymous) {
			showSnackbar("You are not active for this event.");
		}
	};

	const startScouting = (match: EventMatch, teamNumber: string) => {
		if (!eventId || eventId === "undefined" || !event)
			return;
		if (!canSubmitReports) {
			showReportsUnavailable();
			return;
		}

		gameStore.startGame(teamNumber, match.matchNumber, event.year, matchType);
		router.push(`/scouter/${eventId}/game/0`);
	};

	const startManualScouting = (data: ManualGameInputFormData) => {
		if (!eventId || eventId === "undefined" || !event)
			return;
		if (!canSubmitReports) {
			showReportsUnavailable();
			return;
		}

		const teamNumber = normalizeNumberInput(data.teamNumber);
		const gameNumber = normalizeNumberInput(data.gameNumber);
		if (!isPositiveInteger(teamNumber) || !isEventTeam(teamNumber, event.teams)) {
			showSnackbar("Choose a valid team from this event.");
			return;
		}
		if (!isPositiveInteger(gameNumber) || gameNumber > MAX_QUALIFICATION_MATCH_NUMBER) {
			showSnackbar(`Enter a valid ${matchType === "practice" ? "practice" : "qualification"} match number.`);
			return;
		}

		setShowManualDialog(false);
		gameStore.startGame(teamNumber.toString(), gameNumber.toString(), event.year, matchType);
		router.push(`/scouter/${eventId}/game/0`);
	};

	if (!event || eventMatchesStore.isLoading) {
		return <Loading />;
	}

	return <>
		<ScrollView contentContainerStyle={scrollContentStyle}>
			{matchType === "practice" && (
				<MessageCard>
					<Row>
						<IconContainer>
							<Icon name="science" size={28} />
						</IconContainer>
						<MessageText>
							<Title>Practice scouting</Title>
							<Subtitle>Practice reports are saved separately and are not counted in analytics.</Subtitle>
						</MessageText>
					</Row>
				</MessageCard>
			)}
			<TouchableOpacity onPress={() => setShowManualDialog(true)}>
				<Card>
					<Row>
						<IconContainer>
							<Icon name="edit" size={28} />
						</IconContainer>
						<MessageText>
							<Title>Pick manually</Title>
							<Subtitle>Use team and match number if the schedule looks wrong.</Subtitle>
						</MessageText>
						<FlexGrow />
						<Icon name="chevron-right" size={24} />
					</Row>
				</Card>
			</TouchableOpacity>
			{visibleMatches.length === 0 ? (
				<MessageCard>
					<Row>
						<IconContainer>
							<Icon name="event-busy" size={28} />
						</IconContainer>
						<MessageText>
							<Title>No open matches available</Title>
							<Subtitle>{matches.length === 0 ? "This schedule has not been loaded yet." : "All loaded matches are finished."}</Subtitle>
						</MessageText>
					</Row>
				</MessageCard>
			) : visibleMatches.map(match => (
				<MatchCard key={match.id}>
					<Row>
						<IconContainer>
							<Icon name={matchType === "practice" ? "science" : "sports-esports"} size={28} />
						</IconContainer>
						<MessageText>
							<Title>{match.label}</Title>
							<Subtitle>{matchStatusSubtitle(match)}</Subtitle>
						</MessageText>
						<FlexGrow />
						{match.status !== "unknown" && (
							<MatchStatusBadge status={match.status}>
								<MatchStatusText>{matchStatusLabel(match.status)}</MatchStatusText>
							</MatchStatusBadge>
						)}
						<Icon name="chevron-right" size={24} />
					</Row>
					<AllianceSection>
						<AllianceLabel>Red</AllianceLabel>
						<TeamButtonGrid>
							{match.redTeams.map(teamNumber => (
								<TouchableOpacity key={`${match.id}-red-${teamNumber}`} onPress={() => startScouting(match, teamNumber)}>
									<TeamButton alliance="red">
										<TeamButtonText>{teamNumber}</TeamButtonText>
									</TeamButton>
								</TouchableOpacity>
							))}
						</TeamButtonGrid>
					</AllianceSection>
					<AllianceSection>
						<AllianceLabel>Blue</AllianceLabel>
						<TeamButtonGrid>
							{match.blueTeams.map(teamNumber => (
								<TouchableOpacity key={`${match.id}-blue-${teamNumber}`} onPress={() => startScouting(match, teamNumber)}>
									<TeamButton alliance="blue">
										<TeamButtonText>{teamNumber}</TeamButtonText>
									</TeamButton>
								</TouchableOpacity>
							))}
						</TeamButtonGrid>
					</AllianceSection>
				</MatchCard>
			))}
		</ScrollView>
		<FormDialog<ManualGameInputFormData>
			visible={showManualDialog}
			onDismiss={() => setShowManualDialog(false)}
			title={matchType === "practice" ? "Scout a practice match" : "Scout a qualification match"}
			onSubmit={startManualScouting}
			fields={[
				{
					name: "teamNumber",
					label: "Team Number",
					type: "team",
					rules: {
						required: "Choose a team.",
						validate: value => {
							const teamNumber = normalizeNumberInput(value);
							return isPositiveInteger(teamNumber) && isEventTeam(teamNumber, event?.teams ?? []) ? true : "Choose a valid team from this event.";
						},
					},
					teams: event?.teams || [],
				},
				{
					name: "gameNumber",
					label: matchType === "practice" ? "Practice Match Number" : "Match Number",
					type: "number",
					iconLeft: matchType === "practice" ? "science" : "sports-esports",
					rules: {
						required: "Enter a match number.",
						validate: value => {
							const gameNumber = normalizeNumberInput(value);
							return isPositiveInteger(gameNumber) && gameNumber <= MAX_QUALIFICATION_MATCH_NUMBER ? true : "Enter a valid match number.";
						},
					},
				},
			]} />
	</>;
});

function matchStatusLabel(status: EventMatchStatus) {
	switch (status) {
		case "queued":
			return "Queued";
		case "playing":
			return "Playing";
		case "finished":
			return "Finished";
		default:
			return "";
	}
}

function matchStatusSubtitle(match: EventMatch) {
	if (match.nexusStatus) {
		return `Nexus: ${match.nexusStatus}`;
	}

	return "Choose the team you are scouting.";
}

const MatchCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 16px;
`;

const MessageCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 16px;
`;

const MessageText = styled.View`
	flex-shrink: 1;
	gap: 4px;
`;

const AllianceSection = styled.View`
	margin-top: 14px;
	gap: 8px;
`;

const AllianceLabel = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 13px;
	font-weight: 800;
	text-transform: uppercase;
`;

const TeamButtonGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

const TeamButton = styled.View<{alliance: "red" | "blue"}>`
	min-width: 76px;
	min-height: 42px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background-color: ${({alliance}) => alliance === "red" ? "#ef444422" : "#3b82f622"};
	border: 1px solid ${({alliance}) => alliance === "red" ? "#ef444466" : "#3b82f666"};
`;

const TeamButtonText = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 16px;
	font-weight: 800;
`;

const MatchStatusBadge = styled.View<{status: EventMatchStatus}>`
	padding: 5px 8px;
	border-radius: 999px;
	background-color: ${({status}) => {
		switch (status) {
			case "queued":
				return "#f59e0b22";
			case "playing":
				return "#22c55e22";
			case "finished":
				return "#64748b22";
			default:
				return "transparent";
		}
	}};
	border: 1px solid ${({status}) => {
		switch (status) {
			case "queued":
				return "#f59e0b66";
			case "playing":
				return "#22c55e66";
			case "finished":
				return "#64748b66";
			default:
				return "transparent";
		}
	}};
`;

const MatchStatusText = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 12px;
	font-weight: 800;
`;
