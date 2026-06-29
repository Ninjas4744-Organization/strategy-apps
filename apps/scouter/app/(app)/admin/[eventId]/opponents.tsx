import {useContext, useEffect, useMemo} from "react";
import {ScrollView, TouchableOpacity} from "react-native";
import {Href, Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {appColors, CardSurface, Icon, Row, Subtitle, Title} from "@ninjas-strategy/ui";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {games} from "@ninjas-strategy/frc-games";
import {FRCGame, PitAttribute} from "@ninjas-strategy/frc-games/types";
import {Loader} from "@/lib/components/Loader";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import eventMatchesStore from "@/lib/stores/eventMatchesStore";
import eventsStore from "@/lib/stores/eventsStore";
import {Team} from "@/lib/models/Team";
import {EventMatch} from "@/lib/models/EventMatch";

const Container = styled.SafeAreaView`
	background-color: transparent;
	flex: 1;
`;

const HeaderCard = styled(CardSurface)`
	margin: 8px;
	padding: 16px;
`;

const AllianceCard = styled(CardSurface)<{allianceColor: string}>`
	margin: 8px;
	padding: 14px;
	border-left-width: 6px;
	border-left-color: ${props => props.allianceColor};
`;

const TeamCard = styled(CardSurface)`
	margin: 8px 0;
	padding: 14px;
`;

const StatsGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

const StatPill = styled.View`
	min-width: 112px;
	flex: 1;
	padding: 10px;
	border-radius: 8px;
	background-color: ${({theme}) => theme.surface};
`;

const InlineIcon = styled(Icon)<{color?: string}>`
	color: ${props => props.color ?? props.theme.text};
`;

const SectionTitle = styled(Title)`
	font-size: 18px;
`;

const EmptyCard = styled(CardSurface)`
	margin: 16px 8px;
	padding: 18px;
`;

type Alliance = "red" | "blue";

type Stat = {
	label: string;
	value: string | number;
	icon: MaterialIcon;
	color: string;
};

export default observer(function OpponentsScreen() {
	const router = useRouter();
	const {eventId: eventIdParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const eventStore = useContext(EventContext) as EventStore;
	const {teams, isLoading: areTeamsLoading} = eventStore;
	const event = eventId ? eventsStore.events[eventId] : undefined;
	const game = event ? games[event.year] : undefined;
	const {matchesList, isLoading: areMatchesLoading, error} = eventMatchesStore;

	useEffect(() => {
		if (!eventId || eventId === "undefined")
			return;

		eventMatchesStore.subscribeForEvent(eventId);
		return () => eventMatchesStore.unsubscribe();
	}, [eventId]);

	const nextMatch = useMemo(() => getNextMatch(matchesList), [matchesList]);
	const matchTeams = useMemo(() => getMatchTeamNumbers(nextMatch), [nextMatch]);

	if (!event || !game) {
		return <Container>
			<Stack.Screen options={{title: "Next Opponents"}} />
			<EmptyCard>
				<Title>Event unavailable</Title>
				<Subtitle>This event could not be loaded.</Subtitle>
			</EmptyCard>
		</Container>;
	}

	return <Container>
		<Stack.Screen options={{title: "Next Opponents"}} />
		{matchTeams.map(teamNumber => {
			const team = teams[teamNumber];
			return team ? <Loader key={`opponent-loader-${teamNumber}`} subscribe={team.subscribe} unsubscribe={team.unsubscribe} /> : null;
		})}
		<ScrollView>
			<HeaderCard>
				<Row>
					<InlineIcon name="flag" color={appColors.amber500} />
					<Title>Next Opponents</Title>
				</Row>
				{nextMatch ? <>
					<Subtitle>{nextMatch.label} • {nextMatch.status}</Subtitle>
					<Subtitle>{matchTeams.length} teams • {areTeamsLoading || areMatchesLoading ? "Refreshing data" : "Stats ready"}</Subtitle>
				</> : <>
					<Subtitle>{areMatchesLoading ? "Loading match schedule..." : "No upcoming matches found."}</Subtitle>
					{error ? <Subtitle>{error}</Subtitle> : null}
				</>}
			</HeaderCard>

			{nextMatch ? <>
				<AllianceSection
					alliance="red"
					match={nextMatch}
					teams={teams}
					game={game}
					onOpenTeam={teamNumber => router.push(`/admin/${eventId}/team/${teamNumber}` as Href)}
				/>
				<AllianceSection
					alliance="blue"
					match={nextMatch}
					teams={teams}
					game={game}
					onOpenTeam={teamNumber => router.push(`/admin/${eventId}/team/${teamNumber}` as Href)}
				/>
			</> : <EmptyCard>
				<Title>No match selected</Title>
				<Subtitle>Add or sync matches for this event to see the next opponent report.</Subtitle>
			</EmptyCard>}
		</ScrollView>
	</Container>;
});

const AllianceSection = observer(function AllianceSection({
	alliance,
	match,
	teams,
	game,
	onOpenTeam,
}: {
	alliance: Alliance;
	match: EventMatch;
	teams: Record<number, Team>;
	game: FRCGame;
	onOpenTeam: (teamNumber: number) => void;
}) {
	const teamNumbers = (alliance === "red" ? match.redTeams : match.blueTeams)
		.map(teamNumber => Number.parseInt(teamNumber))
		.filter(teamNumber => !Number.isNaN(teamNumber));
	const color = alliance === "red" ? appColors.red500 : appColors.blue500;

	return <AllianceCard allianceColor={color}>
		<Row>
			<InlineIcon name="groups" color={color} />
			<SectionTitle>{capitalize(alliance)} Alliance</SectionTitle>
		</Row>
		{teamNumbers.map(teamNumber => (
			<OpponentTeamCard
				key={`${alliance}-${teamNumber}`}
				teamNumber={teamNumber}
				team={teams[teamNumber]}
				game={game}
				onPress={() => onOpenTeam(teamNumber)}
			/>
		))}
	</AllianceCard>;
});

const OpponentTeamCard = observer(function OpponentTeamCard({
	teamNumber,
	team,
	game,
	onPress,
}: {
	teamNumber: number;
	team?: Team;
	game: FRCGame;
	onPress: () => void;
}) {
	const stats = getTeamStats(team, game);
	const pitValues = getPitValues(team, game);

	return <TouchableOpacity onPress={team ? onPress : undefined} disabled={!team}>
		<TeamCard>
			<Row>
				<Title>{teamNumber}</Title>
				<Subtitle>{team ? `${team.games.length} scout reports` : "No event team record"}</Subtitle>
			</Row>
			<StatsGrid>
				{stats.map(stat => <StatPill key={stat.label}>
					<Row>
						<InlineIcon name={stat.icon} color={stat.color} />
						<Subtitle>{stat.label}</Subtitle>
					</Row>
					<Title>{stat.value}</Title>
				</StatPill>)}
			</StatsGrid>
			<SectionTitle>Pit Scouting</SectionTitle>
			{pitValues.length > 0 ? pitValues.map(value => (
				<Subtitle key={value.label}>{value.label}: {value.value}</Subtitle>
			)) : <Subtitle>{team && hasPitData(team) ? "Pit report saved, but no configured pit fields matched it." : "No pit report yet."}</Subtitle>}
			{team?.strengths.length ? <>
				<SectionTitle>Strengths</SectionTitle>
				<Subtitle>{team.strengths.slice(0, 3).join(" • ")}</Subtitle>
			</> : null}
		</TeamCard>
	</TouchableOpacity>;
});

function getNextMatch(matches: EventMatch[]) {
	return matches.find(match => match.status === "playing" || match.status === "queued" || match.status === "unknown");
}

function getMatchTeamNumbers(match?: EventMatch) {
	if (!match)
		return [];
	return [...match.redTeams, ...match.blueTeams]
		.map(teamNumber => Number.parseInt(teamNumber))
		.filter(teamNumber => !Number.isNaN(teamNumber));
}

function getTeamStats(team: Team | undefined, game: FRCGame): Stat[] {
	const coreStats: Stat[] = [
		{
			label: "Avg Score",
			value: team ? team.averageTotalScore.toFixed(1) : "-",
			icon: "trending-up",
			color: appColors.green500,
		},
		{
			label: "Best",
			value: team ? team.bestScore.toFixed(2) : "-",
			icon: "emoji-events",
			color: appColors.amber500,
		},
		{
			label: "Consistency",
			value: team && team.games.length > 1 ? `${(team.consistencyScore * 100).toFixed(1)}%` : "-",
			icon: "speed",
			color: appColors.blue500,
		},
		{
			label: "Reports",
			value: team ? team.games.length : 0,
			icon: "assignment",
			color: appColors.purple500,
		},
	];

	const performanceStats = game.performance.slice(0, 3).map(stat => ({
		label: stat.label.replace(" Performance", ""),
		value: team ? stat.val(team).toFixed(1) : "-",
		icon: "analytics" as MaterialIcon,
		color: stat.color,
	}));

	return [...coreStats, ...performanceStats];
}

function getPitValues(team: Team | undefined, game: FRCGame) {
	if (!team || !game.pitScoutingAttributes)
		return [];

	return Object.values(game.pitScoutingAttributes)
		.map(attribute => ({
			label: shortPitLabel(attribute),
			value: formatPitValue(team.pitData[attribute.id], attribute),
		}))
		.filter(value => value.value !== "");
}

function hasPitData(team: Team) {
	return Object.keys(team.pitData).length > 0;
}

function formatPitValue(value: unknown, attribute: PitAttribute) {
	if (value === null || value === undefined || value === "")
		return "";
	if (attribute.type === "bool")
		return value ? "Yes" : "No";
	if (attribute.type === "enum" && attribute.values && typeof value === "string")
		return attribute.values[value] ?? value;
	return value.toString();
}

function shortPitLabel(attribute: PitAttribute) {
	return attribute.title.replace(/\?$/, "");
}

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
