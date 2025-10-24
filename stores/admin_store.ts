import {action, makeObservable, observable} from "mobx";
import {Team} from "../models/Team";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../lib/firebase/firestore";
import {Game} from "../models/Game";

class AdminStore {
	@observable teams: Team[] = [];
	@observable isLoading: boolean = true;
	@observable error?: string;

	constructor() {
		makeObservable(this);
		this.loadTeams();
	}

	@action.bound
	async loadTeams() {
		try {
			const teamsRef = collection(db, 'teams');
			const teamsSnapshot = await getDocs(teamsRef);
			for (const teamDoc of teamsSnapshot.docs) {
				const teamData = teamDoc.data();
				const team = Team.fromMap(teamDoc.id, teamData);
				const gamesRef = collection(db, 'teams', team.id, 'games');
				const gamesSnapshot = await getDocs(gamesRef);

				const games = gamesSnapshot.docs.map(game => {
					const data = game.data();
					return Game.fromMap(game.id, data);
				});

				this.teams.push(new Team(
					team.id,
					team.teamNumber,
					games
				));
			}

			this.teams = this.teams.sort((a, b) => b.averageTotalScore > a.averageTotalScore ? 1 : -1);
			this.isLoading = false;
		} catch (e) {
			this.error = `Failed to load teams: ${e}`;
			this.isLoading = false;
		}
	}
}

export default new AdminStore();
