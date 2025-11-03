import {Model} from "@/lib/interfaces/Model";
import {Team} from "@/lib/models/Team";

export class Event implements Model {
	constructor(
		public id: string,
		public year: number,
		public teams: Team[] = []
	) {}

	static fromMap(id: string, data: Record<string, any>): Event {
		return new Event(id, data.year);
	}

	toMap(): Record<string, any> {
		return {
			year: this.year,
		};
	}
}
