import {Timestamp} from "firebase/firestore";
import {Model} from "@/lib/interfaces/Model";

export type MessagingTokenPlatform = 'ios' | 'android' | 'web' | 'unknown';

const optionalDate = (value: unknown): Date | null => {
	if (!value)
		return null;
	if (value instanceof Timestamp)
		return value.toDate();
	if (value instanceof Date)
		return value;
	return null;
};

export class MessagingToken implements Model {
	constructor(
		public id: string,
		public token: string,
		public platform: MessagingTokenPlatform,
		public appVersion: string | null,
		public createdAt: Date | null,
		public updatedAt: Date | null,
		public disabledAt: Date | null,
	) {}

	static fromMap(id: string, data: Record<string, any>): MessagingToken {
		return new MessagingToken(
			id,
			data.token ?? '',
			data.platform ?? 'unknown',
			data.app_version ?? null,
			optionalDate(data.created_at),
			optionalDate(data.updated_at),
			optionalDate(data.disabled_at),
		);
	}

	toMap(): Record<string, any> {
		return {
			token: this.token,
			platform: this.platform,
			app_version: this.appVersion,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
			disabled_at: this.disabledAt,
		};
	}
}
