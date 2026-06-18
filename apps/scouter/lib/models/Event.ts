import {Model} from "@/lib/interfaces/Model";
import {Team} from "@/lib/models/Team";

export class Event implements Model {
	constructor(
		public id: string,
		public year: number,
		public name: string,
		public startDate: string,
		public endDate: string,
		public country: string,
		public teams: string[],
		public active: boolean,
	) {}

	static fromMap(id: string, data: Record<string, any>): Event {
		return new Event(
			id,
			data.year,
			data.name,
			data.start_date,
			data.end_date,
			data.country,
			data.teams,
			data.active ?? true,
		);
	}

	toMap(): Record<string, any> {
		return {
			year: this.year,
			name: this.name,
			start_date: this.startDate,
			end_date: this.endDate,
			country: this.country,
			teams: this.teams,
			active: this.active,
		};
	}
}
