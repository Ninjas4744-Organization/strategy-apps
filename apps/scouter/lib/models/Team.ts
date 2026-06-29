import {Game} from './Game';
import {Model} from '@/lib/interfaces/Model';
import {collection, doc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {action, makeObservable, observable, runInAction} from "mobx";
import {games, Team as TeamCalculation} from "@ninjas-strategy/frc-games";
import {combineLatest, type Subscription} from "rxjs";
import {observeCollection, observeDoc} from "@/lib/utilities";
import {showSnackbar} from "@ninjas-strategy/ui";

export class Team extends TeamCalculation implements Model {
	games: Game[] = [];
	pitData: Record<string, any> = {};
	isLoading: boolean = false;
	private subscription: Subscription | null = null;

	constructor(
		public id: string,
		public eventId: string,
		public eventYear: number,
		public teamNumber: number,
	) {
		super(games[eventYear]);
		makeObservable(this, {
			games: observable.ref,
			pitData: observable.ref,
			isLoading: observable,
			subscribe: action.bound,
			unsubscribe: action.bound,
		});
	}

	static fromMap(id: string, eventId: string, eventYear: number, data: Record<string, any>): Team {
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

		return new Team(id, eventId, eventYear, teamNumber);
	}

	toMap(): Record<string, any> {
		return {
			event_id: this.eventId,
			event_year: this.eventYear,
			team_number: this.teamNumber,
		};
	}

	subscribe() {
		if (this.subscription)
			this.subscription.unsubscribe();

		const gamesRef = collection(db, 'events', this.eventId, 'teams', this.id, 'games');
		const pitRef = doc(db, 'events', this.eventId, 'pit', this.id);

		const gamesObserver = observeCollection(gamesRef);
		const pitObserver = observeDoc(pitRef)

		this.isLoading = true;
		const listener = combineLatest([gamesObserver, pitObserver]);
		this.subscription = listener.subscribe(([gamesSnapshot, pitSnapshot]) => {
			const pitData = pitSnapshot.data() || {};
			runInAction(() => {
				this.pitData = pitData;
				this.games = gamesSnapshot.map(game =>
				{
					try {
						const gameData = game.data();
						return Game.fromMap(game.id, games[this.eventYear], {
							...gameData,
							...pitData
						});
					} catch (e) {
						showSnackbar('Error loading game');
						return Game.fromMap(game.id, games[this.eventYear], {});
					}
				});
				this.isLoading = false;
			});
		});
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}
}
