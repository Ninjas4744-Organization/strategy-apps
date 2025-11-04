import {createContext} from "react";
import {action, computed, makeObservable, observable} from "mobx";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {Team} from "@/lib/models/Team";
import {Game} from "@/lib/models/Game";

type Teams = {
	[id: number]: Team,
};

export const EventContext = createContext<EventStore | null>(null);

export class EventStore {
	@observable loaded: boolean = false;
	@observable teams: Teams = {};
	@observable isLoading: boolean = true;
	@observable error?: string;

	constructor(public eventId: string) {
		makeObservable(this);
	}

	@action.bound
	async loadTeams() {
		this.isLoading = true;
		this.teams = {};
		try {
			const teamsRef = collection(db, 'events', this.eventId, 'teams');
			const teamsSnapshot = await getDocs(teamsRef);
			for (const teamDoc of teamsSnapshot.docs) {
				const teamData = teamDoc.data();
				const team = Team.fromMap(teamDoc.id, teamData);
				const gamesRef = collection(db, 'events', this.eventId, 'teams', team.id, 'games');
				const gamesSnapshot = await getDocs(gamesRef);

				const games = gamesSnapshot.docs.map(game => {
					const data = game.data();
					return Game.fromMap(game.id, data);
				});

				this.teams[team.teamNumber] = new Team(
					team.id,
					team.teamNumber,
					(games || []).sort((a, b) => Number.parseInt(a.gameNumber) > Number.parseInt(b.gameNumber) ? 1 : -1)
				);
			}
		} catch (e) {
			this.error = `Failed to load teams: ${e}`;
		} finally {
			this.loaded = true;
			this.isLoading = false;
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
}
