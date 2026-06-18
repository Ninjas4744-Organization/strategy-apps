import {useContext, useMemo, useState} from "react";
import {ScrollView} from "react-native";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {BeautifulButton, CardSurface, FlexGrow, FormDialog, Icon, Row, SimpleButton, Subtitle, Title, appColors} from "@ninjas-strategy/ui";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import eventsStore from "@/lib/stores/eventsStore";
import assignmentsStore from "@/lib/stores/assignmentsStore";
import teamUsersStore from "@/lib/stores/teamUsersStore";
import {Loader} from "@/lib/components/Loader";
import {type Assignment} from "@/lib/models/Assignment";

type AssignmentFormData = {
	teamNumber: string;
	matchNumber: string | number;
	scouterId: string;
};

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
	const event = eventsStore.events[eventId];
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const scouterOptions = teamUsersStore.scouterOptions;
	const hasScouters = scouterOptions.length > 0;

	const fields = useMemo(() => [
		{
			name: 'teamNumber' as const,
			label: 'Team Number',
			type: 'team' as const,
			teams: event?.teams ?? [],
			rules: {required: true},
		},
		{
			name: 'matchNumber' as const,
			label: 'Match Number',
			type: 'number' as const,
			placeholder: '12',
			rules: {required: true},
		},
		{
			name: 'scouterId' as const,
			label: 'Scouter',
			type: 'select' as const,
			options: scouterOptions,
			placeholder: hasScouters ? 'Choose scouter' : 'No scouters registered',
			rules: {required: true},
			disabled: !hasScouters,
		},
	], [event?.teams, hasScouters, scouterOptions]);

	const createAssignment = (data: AssignmentFormData) => {
		const scouter = teamUsersStore.users[data.scouterId];
		console.log('[AssignmentsPage] createAssignment:submit', {
			eventId,
			formData: data,
			scouter,
			scouterOptions,
		});
		if (!scouter) {
			console.warn('[AssignmentsPage] createAssignment:missingScouter', {
				eventId,
				scouterId: data.scouterId,
				knownUsers: Object.keys(teamUsersStore.users),
			});
			return;
		}

		assignmentsStore.createAssignment(eventId, {
			teamNumber: data.teamNumber,
			matchNumber: data.matchNumber.toString(),
			scouterId: scouter.id,
			scouterName: scouter.name,
		});
	};

	return <>
		<Loader subscribe={() => assignmentsStore.subscribeForEvent(eventId)} unsubscribe={assignmentsStore.unsubscribe} />
		<Loader subscribe={teamUsersStore.subscribeForCurrentTeam} unsubscribe={teamUsersStore.unsubscribe} />
		<ScrollView>
			<PageHeader>
				<Title>Scouting Assignments</Title>
				<Subtitle>{assignmentsStore.assignmentsList.length} assigned games</Subtitle>
			</PageHeader>
			<BeautifulButton
				label="Assign scouter"
				icon="person-add"
				onPress={() => setShowCreateDialog(true)} />
			{!hasScouters && (
				<AssignmentCard>
					<Title>No scouters registered yet</Title>
					<Subtitle>Students need to register with the team member code before they can be assigned.</Subtitle>
				</AssignmentCard>
			)}
			{assignmentsStore.assignmentsList.length === 0 && hasScouters ? (
				<AssignmentCard>
					<Title>No assignments yet</Title>
					<Subtitle>Create assignments for upcoming matches, then scouters will see them in their event screen.</Subtitle>
				</AssignmentCard>
			) : assignmentsStore.assignmentsList.map(assignment => {
				const status = assignmentStatus(assignment);

				return (
					<AssignmentCard key={assignment.id}>
						<Row>
							<Icon name="sports-esports" size={24} />
							<Title>{assignment.matchTitle}</Title>
							<StatusPill color={assignmentStatusColor(status)}>
								<StatusText>{assignmentStatusLabel(status)}</StatusText>
							</StatusPill>
							<FlexGrow />
							<SimpleButton onPress={() => assignmentsStore.deleteAssignment(eventId, assignment.id)}>
								<Icon name="delete" size={22} />
							</SimpleButton>
						</Row>
						<Subtitle>Team {assignment.teamNumber} • {assignment.scouterName}</Subtitle>
						<Subtitle>{assignmentStatusDetail(assignment)}</Subtitle>
						{assignment.notificationError ? (
							<ErrorText numberOfLines={3}>{assignment.notificationError}</ErrorText>
						) : null}
					</AssignmentCard>
				);
			})}
		</ScrollView>
		<FormDialog<AssignmentFormData>
			visible={showCreateDialog}
			onDismiss={() => setShowCreateDialog(false)}
			title="Assign scouter"
			onSubmit={createAssignment}
			fields={fields} />
	</>;
});

const PageHeader = styled.View`
	margin: 16px;
	gap: 4px;
`;

const AssignmentCard = styled(CardSurface)`
	margin: 8px 16px;
	padding: 14px;
	gap: 8px;
`;

const StatusPill = styled.View<{color: string}>`
	background-color: ${({color}) => `${color}22`};
	border: 1px solid ${({color}) => `${color}88`};
	border-radius: 999px;
	padding: 4px 10px;
`;

const StatusText = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 12px;
	font-weight: 700;
`;

const ErrorText = styled(Subtitle)`
	color: ${appColors.red500};
`;
