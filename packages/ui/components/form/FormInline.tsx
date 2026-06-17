import React from "react";
import styled from "styled-components/native";
import {Controller, type FieldValues, type UseFormReturn} from "react-hook-form";

import type {Field} from "./types/fields";
import type {FieldType} from './types/common.ts'
import {Text} from "../../styles/Text";
import {TextInput, TextInputIcon} from "../../styles/TextInput";
import {TeamDropdown} from "../TeamDropdown";
import {BasicInput} from "../BasicInput";

type FormProps<TValues extends FieldValues> = {
	form: UseFormReturn<TValues>;
	fields: Field<TValues>[];
	defaultValues?: Partial<TValues>;
};

const Container = styled.View`
	flex-direction: column;
	gap: 14px;
`;

const FieldBox = styled.View`
	gap: 6px;
`;

const Label = styled(Text)`
	font-weight: 700;
`;

const Desc = styled(Text)`
	opacity: 0.8;
`;

const SwitchRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const HelperText = styled.Text<{ $visible: boolean }>`
	min-height: ${({$visible}) => $visible ? "18px" : "0px"};
	color: ${({theme}) => theme.danger};
	font-size: 12px;
`;

const SwitchTrack = styled.Pressable<{ $active: boolean; $disabled: boolean }>`
	width: 48px;
	height: 28px;
	border-radius: 14px;
	padding: 3px;
	background-color: ${({theme, $active}) => $active ? theme.primary : theme.border};
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
	align-items: ${({$active}) => $active ? "flex-end" : "flex-start"};
`;

const SwitchThumb = styled.View`
	width: 22px;
	height: 22px;
	border-radius: 11px;
	background-color: ${({theme}) => theme.surface};
`;

function keyboardTypeFor(type: FieldType) {
	if (type === "number") return "numeric";
	if (type === "email") return "email-address";
	return "default";
}

function getErrorMessage(errors: any, path: string): string | null {
	const parts = path.split(".");
	let cur = errors;
	for (const p of parts) cur = cur?.[p];
	const msg = cur?.message;
	return typeof msg === "string" ? msg : null;
}

export function FormInline<TValues extends FieldValues>({form, fields}: FormProps<TValues>) {
	const {
		control,
		formState: { errors, isSubmitting },
	} = form;

	return (
		<Container>
			{fields.map((f) => {
				const errorMessage = getErrorMessage(errors, f.name as string);
				const disabled = !!f.disabled || isSubmitting;

				return (
					<FieldBox key={f.name}>
						{f.label ? <Label>{f.label}</Label> : null}
						{f.description ? <Desc>{f.description}</Desc> : null}

						<Controller
							control={control}
							name={f.name}
							rules={f.rules}
							render={({ field }) => {
								if (f.type === "switch") {
									return (
										<>
											<SwitchRow>
												<Text>{f.placeholder ?? f.label ?? ""}</Text>
												<SwitchTrack
													$active={!!field.value}
													$disabled={disabled}
													disabled={disabled}
													onPress={() => field.onChange(!field.value)}>
													<SwitchThumb />
												</SwitchTrack>
											</SwitchRow>
											<HelperText $visible={!!errorMessage}>{errorMessage ?? ""}</HelperText>
										</>
									);
								}

								if (f.type === "team") {
									return (
										<TeamDropdown
											teams={f.teams}
											onSelect={field.onChange}
											value={field.value}
											error={!!errorMessage} />
									);
								}

								if (f.type === "select") {
									return (
										<>
											<TextInput
												label={f.label}
												value={String(field.value ?? "")}
												placeholder={f.placeholder ?? "Select..."}
												editable={false}
												disabled={disabled}
												error={!!errorMessage}
												right={<TextInputIcon icon="chevron-down" disabled />}
												onPressIn={() => {
													// TODO implement as custom (Menu/Dialog/TeamDropdown)
												}}
											/>
											<HelperText $visible={!!errorMessage}>{errorMessage ?? ""}</HelperText>
										</>
									);
								}

								const isPassword = f.type === "password";
								const isMultiline = f.type === "textarea";

								const parseNumber = (text: string) => text.trim() === "" ? undefined : Number(text);

								const value =
									f.type === "number"
										? field.value === undefined || field.value === null
											? ""
											: String(field.value)
										: String(field.value ?? "");

								const onChangeText =
									f.type === "number"
										? (text: string) => field.onChange(parseNumber(text))
										: (text: string) => field.onChange(text);

								return (
									<>
										<BasicInput
											label={f.label}
											value={value}
											onChangeText={onChangeText}
											onBlur={field.onBlur}
											placeholder={f.placeholder}
											disabled={disabled}
											error={!!errorMessage}
											secureTextEntry={isPassword}
											multiline={isMultiline}
											keyboardType={keyboardTypeFor(f.type)}/>
										<HelperText $visible={!!errorMessage}>{errorMessage ?? ""}</HelperText>
									</>
								);
							}}
						/>
					</FieldBox>
				);
			})}
		</Container>
	);
}
