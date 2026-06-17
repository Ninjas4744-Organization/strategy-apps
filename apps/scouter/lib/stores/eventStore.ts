import {createContext} from "react";
import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {collection} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {Team} from "@/lib/models/Team";
import userStore from "@/lib/stores/userStore";
import {UserType} from "@/lib/interfaces/UserType";
import eventsStore from "@/lib/stores/eventsStore";
import {observeCollection} from "@/lib/utilities";
import {Subscription} from "rxjs";

type Teams = {
	[id: number]: Team,
};

export const EventContext = createContext<EventStore | null>(null);

export class EventStore {
	loaded: boolean = false;
	teams: Teams = {};
	_isLoading: boolean = true;
	error: string | undefined = undefined;

	private subscription: Subscription | null = null;

	constructor(public eventId: string) {
		makeObservable(this, {
			loaded: observable,
			teams: observable.ref,
			_isLoading: observable,
			error: observable,
			subscribe: action.bound,
			unsubscribe: action.bound,
			reset: action.bound,
			rank: computed,
			totalGamesCount: computed,
			teamsRanked: computed,
			isLoading: computed,
		});
	}

	reset() {
		this.teams = {};
		this._isLoading = false;
		this.error = undefined;
	}

	async subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}

		if (!this.eventId) {
			this.reset();
			return;
		}

		if (userStore.userData?.type !== UserType.APP_ADMIN && !userStore.user?.isAnonymous) {
			this.reset();
			return;
		}

		const event = eventsStore.events[this.eventId];
		if (!event) {
			this.reset();
			return;
		}

		this._isLoading = true;
		const $teams = observeCollection(collection(db, 'events', this.eventId, 'teams'));
		this.subscription = $teams.subscribe({
			next: teams => {
				runInAction(() => {
					const nextTeams: Teams = {};
					for (const teamDoc of teams) {
						const teamData = teamDoc.data();
						nextTeams[parseInt(teamDoc.id)] = Team.fromMap(teamDoc.id, this.eventId, event.year, teamData);
					}
					this.teams = nextTeams;
					this._isLoading = false;
				});
			},
			error: error => {
				runInAction(() => {
					this.error = error.message;
					this.teams = {};
					this._isLoading = false;
				});
			},
		});
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
		this.reset();
	}

	get rank() {
		return Object.values(this.teams)
			.sort((a, b) => b.averageTotalScore > a.averageTotalScore ? 1 : -1)
			.map(team => team.teamNumber);
	}
	get totalGamesCount() {
		return Object.values(this.teams).reduce((sum, team) => sum + team.games.length, 0);
	}

	get teamsRanked() {
		return this.rank.map(team => this.teams[team]);
	}

	get isLoading() {
		return this._isLoading || Object.values(this.teams).some(team => team.isLoading);
	}
}
