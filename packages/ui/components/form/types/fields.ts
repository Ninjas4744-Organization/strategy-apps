import type { FieldValues } from "react-hook-form";
import type { BaseField, Option } from "./common";

export type TextField<TValues extends FieldValues> = BaseField<TValues> & {
	type: "text" | "email" | "password" | "textarea";
};

export type NumberField<TValues extends FieldValues> = BaseField<TValues> & {
	type: "number";
};

export type SelectField<TValues extends FieldValues> = BaseField<TValues> & {
	type: "select";
	options?: Option[];
};

export type SwitchField<TValues extends FieldValues> = BaseField<TValues> & {
	type: "switch";
};

export type TeamField<TValues extends FieldValues> = BaseField<TValues> & {
	type: "team";
	teams: string[];
};

export type Field<TValues extends FieldValues> =
	| TextField<TValues>
	| NumberField<TValues>
	| SelectField<TValues>
	| SwitchField<TValues>
	| TeamField<TValues>
