import {Model} from "@/lib/interfaces/Model";

export class RegistrationCode implements Model {
	constructor(
		public id: string,
		public membersCode: string,
		public adminsCode: string,
	) {}

	static fromMap(id: string, data: Record<string, any>): RegistrationCode {
		return new RegistrationCode(
			id,
			data.members_code,
			data.admins_code,
		);
	}

	toMap(): Record<string, any> {
		return {
			members_code: this.membersCode,
			admins_code: this.adminsCode,
		};
	}
}
