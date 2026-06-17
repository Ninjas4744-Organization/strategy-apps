import "firebase/auth";
import type {Persistence} from "firebase/auth";

declare module "firebase/auth" {
	export function getReactNativePersistence(storage: unknown): Persistence;
}
