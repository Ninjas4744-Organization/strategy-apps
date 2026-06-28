import {Timestamp} from "firebase/firestore";
import {Model} from "@/lib/interfaces/Model";

export type EventMatchStatus = "queued" | "playing" | "finished" | "unknown";

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
		public matchType: "qualification" | "practice",
		public status: EventMatchStatus,
		public nexusStatus: string | null,
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
			data.match_type === "practice" ? "practice" : "qualification",
			matchStatusFromMap(data.status),
			data.nexus_status ?? null,
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
			match_type: this.matchType,
			status: this.status,
			nexus_status: this.nexusStatus,
			red_teams: this.redTeams,
			blue_teams: this.blueTeams,
			source: this.source,
			updated_at: this.updatedAt,
		};
	}
}

function matchStatusFromMap(value: unknown): EventMatchStatus {
	return value === "queued" || value === "playing" || value === "finished" ? value : "unknown";
}

function teamsFromMap(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map(team => team?.toString().replace(/^frc/i, "").trim())
		.filter(Boolean);
}
