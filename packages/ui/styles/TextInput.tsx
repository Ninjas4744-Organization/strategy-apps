import styled from "styled-components/native";
import {MD2Colors, TextInput as PaperTextInput} from "react-native-paper";

export const TextInput = styled(PaperTextInput).attrs({underlineStyle: {display: 'none'}})`
	background-color: ${MD2Colors.white}70;
	border-radius: 16px;
`;

export const TextInputIcon = PaperTextInput.Icon;
