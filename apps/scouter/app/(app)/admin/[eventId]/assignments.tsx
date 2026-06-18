import {useContext, useMemo, useState} from "react";
import {ScrollView} from "react-native";
import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {BeautifulButton, CardSurface, FlexGrow, FormDialog, Icon, Row, SimpleButton, Subtitle, Title} from "@ninjas-strategy/ui";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import eventsStore from "@/lib/stores/eventsStore";
import assignmentsStore from "@/lib/stores/assignmentsStore";
import teamUsersStore from "@/lib/stores/teamUsersStore";
import {Loader} from "@/lib/components/Loader";

type AssignmentFormData = {
	teamNumber: string;
	matchNumber: string | number;
	scouterId: string;
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
			) : assignmentsStore.assignmentsList.map(assignment => (
				<AssignmentCard key={assignment.id}>
					<Row>
						<Icon name="sports-esports" size={24} />
						<Title>{assignment.matchTitle}</Title>
						<FlexGrow />
						<SimpleButton onPress={() => assignmentsStore.deleteAssignment(eventId, assignment.id)}>
							<Icon name="delete" size={22} />
						</SimpleButton>
					</Row>
					<Subtitle>Team {assignment.teamNumber} • {assignment.scouterName}</Subtitle>
					<Subtitle>{assignment.notifiedAt ? 'Notified' : 'Not notified yet'}</Subtitle>
				</AssignmentCard>
			))}
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
