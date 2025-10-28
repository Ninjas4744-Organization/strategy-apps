import {FieldValue} from "firebase/firestore";

export interface GameData {
	[field: string]: any;
	teamNumber: number;
	gameNumber: number;
	timestamp: FieldValue;
}
