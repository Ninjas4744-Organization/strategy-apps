import type { FieldValues, Path, RegisterOptions, UseFormReturn } from "react-hook-form";
import type {MaterialIcon} from "@/interfaces/MaterialIcon.ts";

export type FieldType =
	| "text"
	| "number"
	| "email"
	| "password"
	| "textarea"
	| "select"
	| "switch"
	| "team"

export type Option = {
	label: string;
	value: string;
};

export type BaseField<TValues extends FieldValues> = {
	name: Path<TValues>;
	label?: string;
	type: FieldType;

	placeholder?: string;
	description?: string;

	rules?: RegisterOptions<TValues, Path<TValues>>;
	disabled?: boolean;

	iconLeft?: MaterialIcon;
	iconRight?: MaterialIcon;
};
