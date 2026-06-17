import {type FieldValues, useForm} from "react-hook-form";
import {Dialog} from "../Dialog";
import {FormInline} from "./FormInline.tsx";
import type {Field} from "./types/fields.ts";
import {useEffect} from "react";
import styled from "styled-components/native";

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
			actions={<SubmitButton onPress={handleSubmit(onSubmit)}><SubmitText>Submit</SubmitText></SubmitButton>} />
	)
}

const SubmitButton = styled.Pressable`
	min-height: 44px;
	padding: 10px 16px;
	border-radius: 12px;
	align-items: center;
	justify-content: center;
	background-color: ${({theme}) => theme.primary};
`;

const SubmitText = styled.Text`
	color: ${({theme}) => theme.primaryText};
	font-weight: 700;
`;
