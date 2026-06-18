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

export class Assignment implements Model {
	constructor(
		public id: string,
		public eventId: string,
		public owningTeam: number,
		public teamNumber: string,
		public matchNumber: string,
		public scouterId: string,
		public scouterName: string,
		public createdBy: string,
		public createdAt: Date | null,
		public updatedAt: Date | null,
		public notifiedAt: Date | null,
		public lastNexusStatus: string | null,
		public nexusDataAsOfTime: number | null,
		public notificationResult: string | null,
		public notificationError: string | null,
	) {}

	static fromMap(id: string, eventId: string, data: Record<string, any>): Assignment {
		return new Assignment(
			id,
			eventId,
			data.owning_team ?? 0,
			data.team_number?.toString() ?? '',
			data.match_number?.toString() ?? '',
			data.scouter_id ?? '',
			data.scouter_name ?? '',
			data.created_by ?? '',
			optionalDate(data.created_at),
			optionalDate(data.updated_at),
			optionalDate(data.notified_at),
			data.last_nexus_status ?? null,
			data.nexus_data_as_of_time ?? null,
			data.notification_result ?? null,
			data.notification_error ?? null,
		);
	}

	toMap(): Record<string, any> {
		return {
			team_number: this.teamNumber,
			owning_team: this.owningTeam,
			match_number: this.matchNumber,
			scouter_id: this.scouterId,
			scouter_name: this.scouterName,
			created_by: this.createdBy,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
			notified_at: this.notifiedAt,
			last_nexus_status: this.lastNexusStatus,
			nexus_data_as_of_time: this.nexusDataAsOfTime,
			notification_result: this.notificationResult,
			notification_error: this.notificationError,
		};
	}

	get matchTitle() {
		return `Match ${this.matchNumber}`;
	}
}
