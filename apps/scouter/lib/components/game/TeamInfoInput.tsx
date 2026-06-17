import styled from "styled-components/native";
import {Icon, TextInput, TextInputIcon, type AppTextInputProps} from "@ninjas-strategy/ui";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

type TeamInfoInputProps = AppTextInputProps & {
	iconRight?: MaterialIcon;
	iconLeft?: MaterialIcon;
}

const TeamInfoInputContainer = styled(TextInput)`
`;

const TeamInfoInputIcon = styled(Icon)`
	font-size: 24px;
	color: ${({theme}) => theme.textMuted};
`;

export const TeamInfoInput = ({...inputProps}: TeamInfoInputProps) => {
	if (inputProps.iconLeft) {
		inputProps.left = <TextInputIcon icon={inputProps.iconLeft!} disabled />;
	}

	if (inputProps.iconRight) {
		inputProps.right = <TextInputIcon icon={inputProps.iconRight!} disabled />;
	}

	return <TeamInfoInputContainer {...inputProps} />;
};
