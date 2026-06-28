import {useContext} from "react";
import {ScrollView} from "react-native";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {CardSurface, FlexGrow, Icon, NativeSelect, type NativeSelectOption, Row, SimpleButton, Subtitle, Switch, Title, appColors} from "@ninjas-strategy/ui";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import assignmentsStore from "@/lib/stores/assignmentsStore";
import teamUsersStore from "@/lib/stores/teamUsersStore";
import eventActiveUsersStore from "@/lib/stores/eventActiveUsersStore";
import eventMatchesStore from "@/lib/stores/eventMatchesStore";
import {Loader} from "@/lib/components/Loader";
import {type Assignment} from "@/lib/models/Assignment";

const UNASSIGNED_VALUE = "__unassigned__";

type AssignmentStatus = "assigned" | "notified" | "failed";

const assignmentStatus = (assignment: Assignment): AssignmentStatus => {
	if (assignment.notificationError) {
		return "failed";
	}

	if (assignment.notifiedAt) {
		return "notified";
	}

	return "assigned";
};

const assignmentStatusLabel = (status: AssignmentStatus) => {
	switch (status) {
		case "failed":
			return "Failed";
		case "notified":
			return "Notified";
		case "assigned":
			return "Assigned";
	}
};

const assignmentStatusColor = (status: AssignmentStatus) => {
	switch (status) {
		case "failed":
			return appColors.red500;
		case "notified":
			return appColors.green500;
		case "assigned":
			return appColors.blue500;
	}
};

const assignmentStatusDetail = (assignment: Assignment) => {
	if (assignment.notificationError) {
		return assignment.notificationResult
			? `Last send failed: ${assignment.notificationResult}`
			: "Last send failed";
	}

	if (assignment.notifiedAt) {
		return `Notified ${assignment.notifiedAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
	}

	if (assignment.lastNexusStatus) {
		return `Last Nexus status: ${assignment.lastNexusStatus}`;
	}

	return "Waiting for queue notification";
};

export default observer(function AssignmentsPage() {
	const eventStore = useContext(EventContext) as EventStore;
	const eventId = eventStore.eventId;
	const qualificationMatches = eventMatchesStore.qualificationMatchesList;
	const isScheduleLoading = eventMatchesStore.isLoading;
	const scheduleError = eventMatchesStore.error;

	const activeUserIds = eventActiveUsersStore.activeUserIds;
	const activeScouters = teamUsersStore.scouters.filter(scouter => activeUserIds.includes(scouter.id));
	const scouterOptions = activeScouters.map(scouter => ({
		label: scouter.name,
		value: scouter.id,
	}));
	const hasScouters = scouterOptions.length > 0;
	const assignmentsByRobot = new Map<string, Assignment>();
	for (const assignment of assignmentsStore.assignmentsList) {
		assignmentsByRobot.set(`${assignment.matchNumber}:${assignment.teamNumber}`, assignment);
	}

	const optionsForRobot = (matchNumber: string, currentAssignment?: Assignment): NativeSelectOption[] => {
		const assignedScouterIds = new Set(
			assignmentsStore.assignmentsList
				.filter(assignment => assignment.matchNumber === matchNumber && assignment.id !== currentAssignment?.id)
				.map(assignment => assignment.scouterId),
		);
		const options: NativeSelectOption[] = [
			{label: "Unassigned", value: UNASSIGNED_VALUE},
			...scouterOptions.map(option => {
				const isBusy = assignedScouterIds.has(option.value);
				return {
					...option,
					label: isBusy ? `${option.label} (busy)` : option.label,
					disabled: isBusy,
				};
			}),
		];

		if (currentAssignment && !options.some(option => option.value === currentAssignment.scouterId)) {
			options.push({
				label: `${currentAssignment.scouterName} (inactive)`,
				value: currentAssignment.scouterId,
			});
		}

		return options;
	};

	const assignRobot = (matchNumber: string, teamNumber: string, scouterId: string) => {
		const currentAssignment = assignmentsByRobot.get(`${matchNumber}:${teamNumber}`);
		if (scouterId === UNASSIGNED_VALUE) {
			if (currentAssignment) {
				assignmentsStore.deleteAssignment(eventId, currentAssignment.id);
			}
			return;
		}

		const scouter = teamUsersStore.users[scouterId];
		if (!scouter) {
			console.warn('[AssignmentsPage] assignRobot:missingScouter', {
				eventId,
				scouterId,
				knownUsers: Object.keys(teamUsersStore.users),
			});
			return;
		}
		if (currentAssignment?.scouterId === scouter.id) {
			return;
		}

		const assignmentInput = {
			teamNumber,
			matchNumber,
			scouterId: scouter.id,
			scouterName: scouter.name,
		};

		if (currentAssignment) {
			assignmentsStore.updateAssignment(eventId, currentAssignment.id, assignmentInput);
			return;
		}

		assignmentsStore.createAssignment(eventId, assignmentInput);
	};

	return <>
		<Loader subscribe={() => assignmentsStore.subscribeForEvent(eventId)} unsubscribe={assignmentsStore.unsubscribe} />
		<Loader subscribe={teamUsersStore.subscribeForCurrentTeam} unsubscribe={teamUsersStore.unsubscribe} />
		<Loader subscribe={() => eventActiveUsersStore.subscribeForEvent(eventId)} unsubscribe={eventActiveUsersStore.unsubscribe} />
		<Loader subscribe={() => eventMatchesStore.subscribeForEvent(eventId)} unsubscribe={eventMatchesStore.unsubscribe} />
		<ScrollView>
			<PageHeader>
				<Title>Scouting Assignments</Title>
				<Subtitle>{assignmentsStore.assignmentsList.length} assigned robots</Subtitle>
			</PageHeader>
			<AssignmentCard>
				<Title>Active Scouters</Title>
				<Subtitle>Only active scouters can submit reports for this event.</Subtitle>
				{teamUsersStore.scouters.length === 0 ? (
					<Subtitle>Students need to register with the team member code first.</Subtitle>
				) : teamUsersStore.scouters.map(scouter => {
					const active = eventActiveUsersStore.activeUsers[scouter.id]?.active === true;

					return (
						<UserRow key={scouter.id}>
							<Icon name={active ? "person" : "person-off"} size={22} />
							<UserCopy>
								<Title>{scouter.name}</Title>
							</UserCopy>
							<Switch
								value={active}
								onValueChange={nextActive => eventActiveUsersStore.setUserActive(eventId, scouter, nextActive)} />
						</UserRow>
					);
				})}
			</AssignmentCard>
			{!hasScouters && (
				<AssignmentCard>
					<Title>No active scouters yet</Title>
					<Subtitle>Turn on at least one scouter above before assigning robots.</Subtitle>
				</AssignmentCard>
			)}
			{isScheduleLoading ? (
				<AssignmentCard>
					<Title>Loading qualification schedule</Title>
					<Subtitle>Fetching matches from The Blue Alliance.</Subtitle>
				</AssignmentCard>
			) : scheduleError ? (
				<AssignmentCard>
					<Row>
						<Icon name="error-outline" size={24} color={appColors.red500} />
						<Title>Schedule failed to load</Title>
						<FlexGrow />
						<SimpleButton onPress={() => eventMatchesStore.subscribeForEvent(eventId)}>
							<Icon name="refresh" size={22} />
						</SimpleButton>
					</Row>
					<ErrorText numberOfLines={3}>{scheduleError}</ErrorText>
				</AssignmentCard>
			) : qualificationMatches.length === 0 ? (
				<AssignmentCard>
					<Title>No qualification schedule yet</Title>
					<Subtitle>Once the TBA qualification schedule is available, every robot will show here.</Subtitle>
				</AssignmentCard>
			) : (
				<ScheduleSection>
					<Row>
						<SectionCopy>
							<Title>Qualification Schedule</Title>
							<Subtitle>{qualificationMatches.length} matches from Firestore</Subtitle>
						</SectionCopy>
						<FlexGrow />
						<SimpleButton onPress={() => eventMatchesStore.subscribeForEvent(eventId)}>
							<Icon name="refresh" size={22} />
						</SimpleButton>
					</Row>
					<HorizontalScroller horizontal showsHorizontalScrollIndicator>
						<Table>
							<TableHeader>
								<MatchHeaderCell>
									<HeaderText>Match</HeaderText>
								</MatchHeaderCell>
								{["Red 1", "Red 2", "Red 3", "Blue 1", "Blue 2", "Blue 3"].map(label => (
									<TeamHeaderCell key={label}>
										<HeaderText>{label}</HeaderText>
									</TeamHeaderCell>
								))}
							</TableHeader>
							{qualificationMatches.map(match => (
								<TableRow key={match.matchNumber}>
									<MatchCell>
										<MatchNumber>{match.matchNumber}</MatchNumber>
									</MatchCell>
									{match.redTeams.map(teamNumber => (
										<RobotAssignmentCell
											key={`qm-${match.matchNumber}-red-${teamNumber}`}
											alliance="red"
											matchNumber={match.matchNumber}
											teamNumber={teamNumber}
											assignment={assignmentsByRobot.get(`${match.matchNumber}:${teamNumber}`)}
											disabled={!hasScouters}
											options={optionsForRobot(match.matchNumber, assignmentsByRobot.get(`${match.matchNumber}:${teamNumber}`))}
											onAssign={assignRobot}
										/>
									))}
									{match.blueTeams.map(teamNumber => (
										<RobotAssignmentCell
											key={`qm-${match.matchNumber}-blue-${teamNumber}`}
											alliance="blue"
											matchNumber={match.matchNumber}
											teamNumber={teamNumber}
											assignment={assignmentsByRobot.get(`${match.matchNumber}:${teamNumber}`)}
											disabled={!hasScouters}
											options={optionsForRobot(match.matchNumber, assignmentsByRobot.get(`${match.matchNumber}:${teamNumber}`))}
											onAssign={assignRobot}
										/>
									))}
								</TableRow>
							))}
						</Table>
					</HorizontalScroller>
				</ScheduleSection>
			)}
		</ScrollView>
	</>;
});

type RobotAssignmentCellProps = {
	alliance: "red" | "blue";
	matchNumber: string;
	teamNumber: string;
	assignment?: Assignment;
	disabled: boolean;
	options: NativeSelectOption[];
	onAssign: (matchNumber: string, teamNumber: string, scouterId: string) => void;
};

const RobotAssignmentCell = ({
	alliance,
	matchNumber,
	teamNumber,
	assignment,
	disabled,
	options,
	onAssign,
}: RobotAssignmentCellProps) => {
	const status = assignment ? assignmentStatus(assignment) : null;

	return (
		<TeamCell alliance={alliance}>
			<TeamCellHeader>
				<TeamNumber>{teamNumber}</TeamNumber>
				{status ? (
					<CompactStatus color={assignmentStatusColor(status)}>
						<CompactStatusText>{assignmentStatusLabel(status)}</CompactStatusText>
					</CompactStatus>
				) : null}
			</TeamCellHeader>
			<NativeSelect
				disabled={disabled}
				value={assignment?.scouterId ?? null}
				placeholder="Choose scouter"
				options={options}
				onSelect={scouterId => onAssign(matchNumber, teamNumber, scouterId)}
			/>
			{assignment ? (
				<CellDetail numberOfLines={2}>{assignmentStatusDetail(assignment)}</CellDetail>
			) : null}
		</TeamCell>
	);
};

const PageHeader = styled.View`
	margin: 16px;
	gap: 4px;
`;

const AssignmentCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 14px;
	gap: 8px;
`;

const UserRow = styled(Row)`
	min-height: 48px;
`;

const UserCopy = styled.View`
	flex: 1;
	min-width: 0;
`;

const ErrorText = styled(Subtitle)`
	color: ${appColors.red500};
`;

const ScheduleSection = styled.View`
	margin: 8px 0 24px;
	gap: 10px;
`;

const SectionCopy = styled.View`
	margin-left: 16px;
	gap: 2px;
`;

const HorizontalScroller = styled.ScrollView`
	padding-left: 16px;
`;

const Table = styled.View`
	min-width: 1060px;
	padding-right: 16px;
`;

const TableHeader = styled.View`
	flex-direction: row;
	align-items: stretch;
	border-bottom-width: 1px;
	border-bottom-color: ${({theme}) => theme.border};
`;

const TableRow = styled.View`
	flex-direction: row;
	align-items: stretch;
	border-bottom-width: 1px;
	border-bottom-color: ${({theme}) => theme.border};
`;

const MatchHeaderCell = styled.View`
	width: 76px;
	min-height: 44px;
	justify-content: center;
	padding: 8px;
`;

const TeamHeaderCell = styled.View`
	width: 164px;
	min-height: 44px;
	justify-content: center;
	padding: 8px;
`;

const HeaderText = styled.Text`
	color: ${({theme}) => theme.textMuted};
	font-size: 12px;
	font-weight: 800;
	text-transform: uppercase;
`;

const MatchCell = styled.View`
	width: 76px;
	min-height: 104px;
	justify-content: center;
	padding: 8px;
`;

const MatchNumber = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 22px;
	font-weight: 800;
	text-align: center;
`;

const TeamCell = styled.View<{alliance: "red" | "blue"}>`
	width: 164px;
	min-height: 104px;
	padding: 8px;
	gap: 4px;
	background-color: ${({alliance}) => alliance === "red" ? `${appColors.red500}10` : `${appColors.blue500}10`};
	border-left-width: 1px;
	border-left-color: ${({theme}) => theme.border};
`;

const TeamCellHeader = styled.View`
	min-height: 24px;
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

const TeamNumber = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 16px;
	font-weight: 800;
`;

const CompactStatus = styled.View<{color: string}>`
	background-color: ${({color}) => `${color}22`};
	border: 1px solid ${({color}) => `${color}88`};
	border-radius: 999px;
	padding: 2px 6px;
`;

const CompactStatusText = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 10px;
	font-weight: 800;
`;

const CellDetail = styled(Subtitle)`
	font-size: 11px;
	line-height: 14px;
`;
