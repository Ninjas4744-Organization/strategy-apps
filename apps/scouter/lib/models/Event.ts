import {Model} from "@/lib/interfaces/Model";
import {Team} from "@/lib/models/Team";

export class Event implements Model {
	constructor(
		public id: string,
		public year: number,
		public name: string,
		public startDate: string,
		public endDate: string,
		public teams: Team[] = []
	) {}

	static fromMap(id: string, data: Record<string, any>): Event {
		return new Event(
			id,
			data.year,
			data.eventName,
			data.start_date,
			data.end_date
		);
	}

	toMap(): Record<string, any> {
		return {
			year: this.year,
			eventName: this.name,
			start_date: this.startDate,
			end_date: this.endDate,
		};
	}
}
