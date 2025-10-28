export interface Model {
	id: string;
	toMap(): Record<string, any>;
}
