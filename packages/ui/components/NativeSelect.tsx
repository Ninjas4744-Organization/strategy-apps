import {Host, Picker} from "@expo/ui";
import {useMemo, useState} from "react";
import {Modal, Platform, ScrollView} from "react-native";
import styled from "styled-components/native";
import {Icon} from "./Icon";
import {Text} from "../styles/Text";

export type NativeSelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type NativeSelectProps = {
	disabled?: boolean;
	error?: boolean;
	label?: string;
	onSelect: (value: string) => void;
	options: NativeSelectOption[];
	placeholder?: string;
	value: string | null | undefined;
	valueLabel?: string;
};

const PLACEHOLDER_VALUE = "__placeholder__";

export const NativeSelect = ({
	disabled,
	error,
	label,
	onSelect,
	options,
	placeholder = "Select",
	value,
}: NativeSelectProps) => {
	const selectedValue = value ?? PLACEHOLDER_VALUE;
	const [androidModalVisible, setAndroidModalVisible] = useState(false);
	const selectedOption = useMemo(
		() => options.find(option => option.value === value),
		[options, value],
	);

	if (Platform.OS === "android") {
		return (
			<>
				<AndroidSelectButton
					$disabled={!!disabled}
					$error={!!error}
					disabled={disabled}
					onPress={() => setAndroidModalVisible(true)}>
					<AndroidSelectCopy>
						{label ? <Label>{label}</Label> : null}
						<AndroidSelectValue $placeholder={!selectedOption}>
							{selectedOption?.label ?? placeholder}
						</AndroidSelectValue>
					</AndroidSelectCopy>
					<Icon name="expand-more" size={24} />
				</AndroidSelectButton>

				<Modal
					animationType="fade"
					transparent
					visible={androidModalVisible}
					onRequestClose={() => setAndroidModalVisible(false)}>
					<AndroidModalBackdrop onPress={() => setAndroidModalVisible(false)}>
						<AndroidModalPanel onPress={event => event.stopPropagation()}>
							<AndroidModalTitle>{label ?? placeholder}</AndroidModalTitle>
							<AndroidOptionsList keyboardShouldPersistTaps="handled">
								{options.map(option => (
									<AndroidOption
										key={option.value}
										$selected={option.value === value}
										$disabled={!!option.disabled}
										disabled={option.disabled}
										onPress={() => {
											onSelect(option.value);
											setAndroidModalVisible(false);
										}}>
										<AndroidOptionText
											$selected={option.value === value}
											$disabled={!!option.disabled}>
											{option.label}
										</AndroidOptionText>
									</AndroidOption>
								))}
							</AndroidOptionsList>
						</AndroidModalPanel>
					</AndroidModalBackdrop>
				</Modal>
			</>
		);
	}

	return (
		<Field $disabled={!!disabled} $error={!!error}>
			{label ? <Label>{label}</Label> : null}
			<NativePickerHost matchContents={false}>
				<Picker
					appearance="menu"
					enabled={!disabled}
					selectedValue={selectedValue}
					onValueChange={nextValue => {
						if (nextValue === PLACEHOLDER_VALUE) {
							return;
						}

						const option = options.find(item => item.value === nextValue);
						if (option?.disabled) {
							return;
						}

						onSelect(String(nextValue));
					}}>
					<Picker.Item label={placeholder} value={PLACEHOLDER_VALUE} />
					{options.map(option => (
						<Picker.Item
							key={option.value}
							label={option.label}
							value={option.value}
						/>
					))}
				</Picker>
			</NativePickerHost>
		</Field>
	);
};

const Field = styled.View<{ $disabled: boolean; $error: boolean }>`
	min-height: 44px;
	width: 100%;
	justify-content: center;
	border-bottom-width: 1px;
	border-bottom-color: ${({theme, $error}) => $error ? theme.danger : theme.border};
	padding: 4px 0;
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
`;

const Label = styled(Text)`
	color: ${({theme}) => theme.textMuted};
	font-size: 12px;
	font-weight: 500;
	margin-bottom: 1px;
`;

const NativePickerHost = styled(Host)`
	min-height: 28px;
	width: 100%;
	justify-content: center;
`;

const AndroidSelectButton = styled.Pressable<{ $disabled: boolean; $error: boolean }>`
	min-height: 56px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${({theme, $error}) => $error ? theme.danger : theme.border};
	background-color: ${({theme}) => theme.inputBackground};
	padding: 7px 12px;
	opacity: ${({$disabled}) => $disabled ? 0.55 : 1};
`;

const AndroidSelectCopy = styled.View`
	flex: 1;
	min-width: 0;
	gap: 2px;
`;

const AndroidSelectValue = styled(Text)<{ $placeholder: boolean }>`
	color: ${({theme, $placeholder}) => $placeholder ? theme.textMuted : theme.text};
	font-size: 16px;
`;

const AndroidModalBackdrop = styled.Pressable`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.42);
	padding: 24px;
`;

const AndroidModalPanel = styled.Pressable`
	width: 100%;
	max-width: 420px;
	max-height: 80%;
	border-radius: 16px;
	background-color: ${({theme}) => theme.surface};
	padding: 16px;
`;

const AndroidModalTitle = styled(Text)`
	font-size: 18px;
	font-weight: 800;
	margin-bottom: 10px;
`;

const AndroidOptionsList = styled(ScrollView)`
	max-height: 420px;
`;

const AndroidOption = styled.Pressable<{ $selected: boolean; $disabled: boolean }>`
	min-height: 48px;
	justify-content: center;
	border-radius: 10px;
	padding: 10px 12px;
	background-color: ${({theme, $selected}) => $selected ? theme.inputBackground : "transparent"};
	opacity: ${({$disabled}) => $disabled ? 0.45 : 1};
`;

const AndroidOptionText = styled(Text)<{ $selected: boolean; $disabled: boolean }>`
	font-size: 16px;
	font-weight: ${({$selected}) => $selected ? 800 : 500};
	color: ${({theme, $disabled}) => $disabled ? theme.textMuted : theme.text};
`;
