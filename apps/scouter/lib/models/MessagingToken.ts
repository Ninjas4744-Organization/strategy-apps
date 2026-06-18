import {Timestamp} from "firebase/firestore";
import {Model} from "@/lib/interfaces/Model";
import {UserType} from "@/lib/interfaces/UserType";

export type MessagingTokenPlatform = 'ios' | 'android' | 'web' | 'unknown';
export type MessagingTokenType = MessagingTokenPlatform | 'expo';
export type MessagingTokenProvider = 'native' | 'expo';

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
		public tokenType: MessagingTokenType,
		public provider: MessagingTokenProvider,
		public platform: MessagingTokenPlatform,
		public userType: UserType | null,
		public team: number | null,
		public appVersion: string | null,
		public createdAt: Date | null,
		public updatedAt: Date | null,
		public disabledAt: Date | null,
	) {}

	static fromMap(id: string, data: Record<string, any>): MessagingToken {
		return new MessagingToken(
			id,
			data.token ?? '',
			data.token_type ?? 'unknown',
			data.provider ?? (data.token_type === 'expo' ? 'expo' : 'native'),
			data.platform ?? 'unknown',
			data.user_type ?? null,
			typeof data.team === 'number' ? data.team : null,
			data.app_version ?? null,
			optionalDate(data.created_at),
			optionalDate(data.updated_at),
			optionalDate(data.disabled_at),
		);
	}

	toMap(): Record<string, any> {
		return {
			token: this.token,
			token_type: this.tokenType,
			provider: this.provider,
			platform: this.platform,
			user_type: this.userType,
			team: this.team,
			app_version: this.appVersion,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
			disabled_at: this.disabledAt,
		};
	}
}
