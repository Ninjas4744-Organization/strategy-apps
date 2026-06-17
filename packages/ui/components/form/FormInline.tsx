import React from "react";
import styled from "styled-components/native";
import {Controller, type FieldValues, type UseFormReturn} from "react-hook-form";

import type {Field} from "./types/fields";
import type {FieldType} from './types/common.ts'
import {Text} from "../../styles/Text";
import {TeamDropdown} from "../TeamDropdown";
import {NativeSelect} from "../NativeSelect";
import {NativeTextField} from "../NativeTextField";
import {Switch} from "../Switch";

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

const Desc = styled(Text)`
	opacity: 0.8;
`;

const SwitchRow = styled.View<{ $disabled: boolean }>`
	min-height: 62px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	opacity: ${({$disabled}) => $disabled ? 0.45 : 1};
`;

const SwitchCopy = styled.View`
	flex: 1;
	min-width: 0;
	gap: 2px;
`;

const SwitchTitle = styled.Text`
	color: ${({theme}) => theme.text};
	font-size: 16px;
	font-weight: 700;
	line-height: 20px;
`;

const SwitchDescription = styled.Text`
	color: ${({theme}) => theme.textMuted};
	font-size: 13px;
	line-height: 17px;
`;

const HelperText = styled.Text<{ $visible: boolean }>`
	min-height: ${({$visible}) => $visible ? "18px" : "0px"};
	color: ${({theme}) => theme.danger};
	font-size: 12px;
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
						{f.type !== "switch" && f.description ? <Desc>{f.description}</Desc> : null}

						<Controller
							control={control}
							name={f.name}
							rules={f.rules}
							render={({ field }) => {
								if (f.type === "switch") {
									return (
										<>
											<SwitchRow $disabled={disabled} accessibilityState={{disabled}}>
												<SwitchCopy>
													<SwitchTitle numberOfLines={1}>{f.placeholder ?? f.label ?? ""}</SwitchTitle>
													{f.description ? (
														<SwitchDescription numberOfLines={2}>{f.description}</SwitchDescription>
													) : null}
												</SwitchCopy>
												<Switch
													value={!!field.value}
													disabled={disabled}
													onValueChange={field.onChange}/>
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
											<NativeSelect
												label={f.label}
												disabled={disabled}
												error={!!errorMessage}
												value={field.value == null ? null : String(field.value)}
												placeholder={f.placeholder ?? "Select..."}
												options={f.options ?? []}
												onSelect={field.onChange}
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
										<NativeTextField
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
