import {type FieldValues, useForm} from "react-hook-form";
import {Dialog} from "../Dialog";
import {Button} from "react-native-paper";
import {FormInline} from "./FormInline.tsx";
import type {Field} from "./types/fields.ts";
import {useEffect} from "react";

type FormDialogProps<TValues extends FieldValues> = {
	visible: boolean;
	onDismiss: () => void;
	title: string;
	onSubmit: (data: TValues) => void;
	defaultValues?: Partial<TValues>;
	fields: Field<TValues>[];
}

export function FormDialog<T extends FieldValues>({fields, visible, onDismiss, title, onSubmit, defaultValues}: FormDialogProps<T>) {
	const form = useForm<T>({
		defaultValues: defaultValues as any,
		mode: "onSubmit",
	});
	const {reset, handleSubmit, formState: {isSubmitSuccessful}} = form;

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
			onDismiss();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<Dialog
			visible={visible}
			onDismiss={() => (reset(), onDismiss())}
			title={title}
			content={<FormInline form={form} fields={fields} />}
			actions={<Button onPress={handleSubmit(onSubmit)}>Submit</Button>} />
	)
}
