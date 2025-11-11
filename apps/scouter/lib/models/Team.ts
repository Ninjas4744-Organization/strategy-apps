import {Game} from './Game';
import {Model} from '@/lib/interfaces/Model';
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {action, makeObservable, observable, runInAction} from "mobx";
import {games, Team as TeamCalculation} from "@ninjas-strategy/frc-games";

export class Team extends TeamCalculation implements Model {
	@observable games: Game[] = [];
	@observable isLoading: boolean = true;
	private _unsubscribe: (() => void) | null = null;

	constructor(
		public id: string,
		public eventId: string,
		public teamNumber: number,
	) {
		super(games[2025]);
		makeObservable(this);
	}

	static fromMap(id: string, eventId: string, data: Record<string, any>): Team {
		// Handle team_number as either string or int
		let teamNumber = 0;
		const teamNumberData = data['team_number'];
		if (teamNumberData !== null && teamNumberData !== undefined) {
			if (typeof teamNumberData === 'number') {
				teamNumber = teamNumberData;
			} else if (typeof teamNumberData === 'string') {
				teamNumber = parseInt(teamNumberData) || 0;
			}
		}

		return new Team(id, eventId, teamNumber);
	}

	toMap(): Record<string, any> {
		return {
			team_number: this.teamNumber,
		};
	}

	@action.bound
	subscribe() {
		if (this._unsubscribe)
			this._unsubscribe();

		const gamesRef = collection(db, 'events', this.eventId, 'teams', this.id, 'games');

		this.isLoading = true;
		this._unsubscribe = onSnapshot(gamesRef, snapshot => {
			runInAction(() => {
				this.games = snapshot.docs.map(game => {
					const data = game.data();
					return Game.fromMap(game.id, games[2025], data);
				}).sort((a, b) => Number.parseInt(a.gameNumber) > Number.parseInt(b.gameNumber) ? 1 : -1);
				this.isLoading = false;
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

	// Calculate team statistics
	get cageGames(): number {
		if (this.games.length === 0) return 0;
		return this.games.filter(game => game.cageLevel !== CageLevel.NONE).length;
	}
}
