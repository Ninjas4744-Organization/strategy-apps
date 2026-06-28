import {Timestamp} from "firebase/firestore";
import {Model} from "@/lib/interfaces/Model";

const optionalDate = (value: unknown): Date | null => {
	if (!value)
		return null;
	if (value instanceof Timestamp)
		return value.toDate();
	if (value instanceof Date)
		return value;
	return null;
};

export class EventMatch implements Model {
	constructor(
		public id: string,
		public eventId: string,
		public label: string,
		public matchNumber: string,
		public redTeams: string[],
		public blueTeams: string[],
		public source: string,
		public updatedAt: Date | null,
	) {}

	static fromMap(id: string, eventId: string, data: Record<string, any>): EventMatch {
		return new EventMatch(
			id,
			eventId,
			data.label ?? `Qualification ${data.match_number ?? id}`,
			data.match_number?.toString() ?? id,
			teamsFromMap(data.red_teams),
			teamsFromMap(data.blue_teams),
			data.source ?? "",
			optionalDate(data.updated_at),
		);
	}

	toMap(): Record<string, any> {
		return {
			label: this.label,
			match_number: this.matchNumber,
			red_teams: this.redTeams,
			blue_teams: this.blueTeams,
			source: this.source,
			updated_at: this.updatedAt,
		};
	}
}

function teamsFromMap(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map(team => team?.toString().replace(/^frc/i, "").trim())
		.filter(Boolean);
}
