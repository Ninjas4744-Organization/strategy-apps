import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection, deleteDoc, doc, DocumentData, query, QueryDocumentSnapshot, serverTimestamp, setDoc, where} from "firebase/firestore";
import {type Subscription} from "rxjs";
import {showSnackbar} from "@ninjas-strategy/ui";
import {db} from "@/lib/firebase/firestore";
import {Assignment} from "@/lib/models/Assignment";
import userStore from "@/lib/stores/userStore";
import {observeCollection} from "@/lib/utilities";

type Assignments = {
	[assignmentId: string]: Assignment;
};

export type AssignmentInput = {
	teamNumber: string;
	matchNumber: string;
	scouterId: string;
	scouterName: string;
};

const assignmentIdFor = (matchNumber: string, teamNumber: string) => (
	`match-${matchNumber.trim()}-team-${teamNumber.trim()}`.replace(/[^A-Za-z0-9_-]/g, '_')
);

const normalizeAssignment = (assignment: AssignmentInput): AssignmentInput => ({
	...assignment,
	matchNumber: assignment.matchNumber.trim(),
	teamNumber: assignment.teamNumber.trim(),
});

const logFirebaseError = (label: string, error: unknown, context: Record<string, unknown> = {}) => {
	const firebaseError = error as {code?: string; message?: string; name?: string; stack?: string};
	console.error(`[AssignmentsStore] ${label}`, {
		code: firebaseError?.code,
		message: firebaseError?.message,
		name: firebaseError?.name,
		context,
		error,
		stack: firebaseError?.stack,
	});
};

class AssignmentsStore {
	isLoading: boolean = false;
	assignments: Assignments = {};
	private subscription: Subscription | null = null;
	private subscribedEventId: string | null = null;

	constructor() {
		makeObservable(this, {
			isLoading: observable,
			assignments: observable.ref,
			subscribeForEvent: action.bound,
			subscribeForScouter: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			applyAssignments: action.bound,
			createAssignment: action.bound,
			updateAssignment: action.bound,
			deleteAssignment: action.bound,
			assignmentsList: computed,
		});
	}

	reset() {
		this.assignments = {};
		this.isLoading = false;
		this.subscribedEventId = null;
	}

	applyAssignments(eventId: string, docs: QueryDocumentSnapshot<DocumentData>[]) {
		const nextAssignments: Assignments = {};
		for (const assignmentDoc of docs) {
			const assignment = Assignment.fromMap(assignmentDoc.id, eventId, assignmentDoc.data());
			nextAssignments[assignment.id] = assignment;
		}
		this.assignments = nextAssignments;
		this.isLoading = false;
	}

	subscribeForEvent(eventId: string) {
		console.log('[AssignmentsStore] subscribeForEvent:start', {
			eventId,
			userId: userStore.user?.uid,
			userType: userStore.userData?.type,
			userTeam: userStore.userData?.team,
		});
		this.unsubscribe();
		if (!eventId) {
			this.reset();
			return;
		}

		this.subscribedEventId = eventId;
		this.isLoading = true;
		const assignmentsCollection = collection(db, 'events', eventId, 'assignments');
		const assignmentsRef = userStore.userData?.type === 'app_admin'
			? query(assignmentsCollection)
			: query(assignmentsCollection, where('owning_team', '==', userStore.userData?.team));

		this.subscription = observeCollection(assignmentsRef).subscribe({
			next: assignments => {
				console.log('[AssignmentsStore] subscribeForEvent:success', {
					eventId,
					count: assignments.length,
				});
				runInAction(() => this.applyAssignments(eventId, assignments));
			},
			error: error => {
				logFirebaseError('subscribeForEvent:error', error, {
					eventId,
					userId: userStore.user?.uid,
					userType: userStore.userData?.type,
					userTeam: userStore.userData?.team,
				});
				showSnackbar(`Failed to load assignments: ${error.message}`);
				runInAction(() => this.reset());
			},
		});
	}

	subscribeForScouter(eventId: string) {
		console.log('[AssignmentsStore] subscribeForScouter:start', {
			eventId,
			userId: userStore.user?.uid,
			userType: userStore.userData?.type,
			userTeam: userStore.userData?.team,
		});
		this.unsubscribe();
		const scouterId = userStore.user?.uid;
		if (!eventId || !scouterId) {
			this.reset();
			return;
		}

		this.subscribedEventId = eventId;
		this.isLoading = true;
		const assignmentsRef = query(
			collection(db, 'events', eventId, 'assignments'),
			where('scouter_id', '==', scouterId),
		);

		this.subscription = observeCollection(assignmentsRef).subscribe({
			next: assignments => {
				console.log('[AssignmentsStore] subscribeForScouter:success', {
					eventId,
					scouterId,
					count: assignments.length,
				});
				runInAction(() => this.applyAssignments(eventId, assignments));
			},
			error: error => {
				logFirebaseError('subscribeForScouter:error', error, {
					eventId,
					scouterId,
					userType: userStore.userData?.type,
					userTeam: userStore.userData?.team,
				});
				showSnackbar(`Failed to load your assignments: ${error.message}`);
				runInAction(() => this.reset());
			},
		});
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
		this.reset();
	}

	async createAssignment(eventId: string, assignment: AssignmentInput) {
		const normalizedAssignment = normalizeAssignment(assignment);
		console.log('[AssignmentsStore] createAssignment:start', {
			eventId,
			assignment: normalizedAssignment,
			userId: userStore.user?.uid,
			userType: userStore.userData?.type,
			userTeam: userStore.userData?.team,
		});
		if (!userStore.user) {
			showSnackbar('You must be signed in to create assignments');
			return;
		}
		if (!userStore.userData) {
			showSnackbar('Your user profile is still loading');
			return;
		}
		if (!normalizedAssignment.matchNumber || !normalizedAssignment.teamNumber) {
			showSnackbar('Choose both a match number and team');
			return;
		}
		if (this.hasRobotAssignment(normalizedAssignment.matchNumber, normalizedAssignment.teamNumber)) {
			showSnackbar(`Team ${normalizedAssignment.teamNumber} is already assigned for match ${normalizedAssignment.matchNumber}`);
			return;
		}
		if (this.hasScouterAssignment(normalizedAssignment.matchNumber, normalizedAssignment.scouterId)) {
			showSnackbar(`${normalizedAssignment.scouterName} is already assigned for match ${normalizedAssignment.matchNumber}`);
			return;
		}

		try {
			const assignmentRef = doc(db, 'events', eventId, 'assignments', assignmentIdFor(normalizedAssignment.matchNumber, normalizedAssignment.teamNumber));
			const assignmentDoc = {
				owning_team: userStore.userData.team,
				team_number: normalizedAssignment.teamNumber,
				match_number: normalizedAssignment.matchNumber,
				scouter_id: normalizedAssignment.scouterId,
				scouter_name: normalizedAssignment.scouterName,
				created_by: userStore.user.uid,
				created_at: serverTimestamp(),
				updated_at: serverTimestamp(),
				notified_at: null,
				last_nexus_status: null,
				nexus_data_as_of_time: null,
				notification_result: null,
				notification_error: null,
			};

			console.log('[AssignmentsStore] createAssignment:writing', {
				eventId,
				assignmentId: assignmentRef.id,
				path: assignmentRef.path,
				assignmentDoc,
			});
			await setDoc(assignmentRef, assignmentDoc);
			console.log('[AssignmentsStore] createAssignment:success', {
				eventId,
				assignmentId: assignmentRef.id,
			});
			showSnackbar('Assignment created');
		} catch (e) {
			logFirebaseError('createAssignment:error', e, {
				eventId,
				assignment: normalizedAssignment,
				userId: userStore.user?.uid,
				userType: userStore.userData?.type,
				userTeam: userStore.userData?.team,
			});
			showSnackbar(`Failed to create assignment: ${e}`);
		}
	}

	async updateAssignment(eventId: string, assignmentId: string, assignment: AssignmentInput) {
		const normalizedAssignment = normalizeAssignment(assignment);
		if (this.hasRobotAssignment(normalizedAssignment.matchNumber, normalizedAssignment.teamNumber, assignmentId)) {
			showSnackbar(`Team ${normalizedAssignment.teamNumber} is already assigned for match ${normalizedAssignment.matchNumber}`);
			return;
		}
		if (this.hasScouterAssignment(normalizedAssignment.matchNumber, normalizedAssignment.scouterId, assignmentId)) {
			showSnackbar(`${normalizedAssignment.scouterName} is already assigned for match ${normalizedAssignment.matchNumber}`);
			return;
		}

		try {
			const assignmentRef = doc(db, 'events', eventId, 'assignments', assignmentId);
			const assignmentDoc = {
				team_number: normalizedAssignment.teamNumber,
				match_number: normalizedAssignment.matchNumber,
				scouter_id: normalizedAssignment.scouterId,
				scouter_name: normalizedAssignment.scouterName,
				updated_at: serverTimestamp(),
				notified_at: null,
				last_nexus_status: null,
				nexus_data_as_of_time: null,
				notification_result: null,
				notification_error: null,
			};
			console.log('[AssignmentsStore] updateAssignment:writing', {
				eventId,
				assignmentId,
				path: assignmentRef.path,
				assignmentDoc,
			});
			await setDoc(assignmentRef, assignmentDoc, {merge: true});
			console.log('[AssignmentsStore] updateAssignment:success', {eventId, assignmentId});
			showSnackbar('Assignment updated');
		} catch (e) {
			logFirebaseError('updateAssignment:error', e, {
				eventId,
				assignmentId,
				assignment: normalizedAssignment,
			});
			showSnackbar(`Failed to update assignment: ${e}`);
		}
	}

	async deleteAssignment(eventId: string, assignmentId: string) {
		try {
			console.log('[AssignmentsStore] deleteAssignment:start', {eventId, assignmentId});
			await deleteDoc(doc(db, 'events', eventId, 'assignments', assignmentId));
			console.log('[AssignmentsStore] deleteAssignment:success', {eventId, assignmentId});
			showSnackbar('Assignment removed');
		} catch (e) {
			logFirebaseError('deleteAssignment:error', e, {eventId, assignmentId});
			showSnackbar(`Failed to remove assignment: ${e}`);
		}
	}

	get assignmentsList() {
		return Object.values(this.assignments)
			.sort((a, b) => Number(a.matchNumber) - Number(b.matchNumber));
	}

	private hasRobotAssignment(matchNumber: string, teamNumber: string, excludingAssignmentId?: string) {
		return this.assignmentsList.some(assignment =>
			assignment.id !== excludingAssignmentId
			&& assignment.matchNumber === matchNumber
			&& assignment.teamNumber === teamNumber
		);
	}

	private hasScouterAssignment(matchNumber: string, scouterId: string, excludingAssignmentId?: string) {
		return this.assignmentsList.some(assignment =>
			assignment.id !== excludingAssignmentId
			&& assignment.matchNumber === matchNumber
			&& assignment.scouterId === scouterId
		);
	}
}

const assignmentsStore = new AssignmentsStore();
export default assignmentsStore;
