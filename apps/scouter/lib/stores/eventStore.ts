import {createContext} from "react";
import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {Team} from "@/lib/models/Team";
import userStore from "@/lib/stores/userStore";
import {UserType} from "@/lib/interfaces/UserType";
import eventsStore from "@/lib/stores/eventsStore";

type Teams = {
	[id: number]: Team,
};

export const EventContext = createContext<EventStore | null>(null);

export class EventStore {
	@observable loaded: boolean = false;
	@observable teams: Teams = {};
	@observable _isLoading: boolean = true;
	@observable error?: string;

	private _unsubscribe: (() => void) | null = null;

	constructor(public eventId: string) {
		makeObservable(this);
	}

	@action.bound
	async subscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
		}

		if (userStore.userData?.type !== UserType.APP_ADMIN)
			return;

		const event = eventsStore.events[this.eventId];

		const teamsRef = collection(db, 'events', this.eventId, 'teams');

		this._isLoading = true;
		this._unsubscribe = onSnapshot(teamsRef, snapshot => {
			runInAction(() => {
				for (const teamDoc of snapshot.docs) {
					const teamData = teamDoc.data();
					this.teams[parseInt(teamDoc.id)] = Team.fromMap(teamDoc.id, this.eventId, event.year, teamData);
				}
				this._isLoading = false;
			});
		});
	}

	@action.bound
	unsubscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
			this._unsubscribe = null;
		}
	}

	@computed
	get rank() {
		return Object.values(this.teams)
			.sort((a, b) => b.averageTotalScore > a.averageTotalScore ? 1 : -1)
			.map(team => team.teamNumber);
	}
	@computed
	get totalGamesCount() {
		return Object.values(this.teams).reduce((sum, team) => sum + team.games.length, 0);
	}

	@computed
	get teamsRanked() {
		return this.rank.map(team => this.teams[team]);
	}

	@computed
	get isLoading() {
		return this._isLoading || Object.values(this.teams).some(team => team.isLoading);
	}
}
