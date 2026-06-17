import {Host, Picker} from "@expo/ui";
import styled from "styled-components/native";
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
