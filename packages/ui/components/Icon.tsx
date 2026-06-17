import {MaterialIcons} from "@expo/vector-icons";
import styled, {css} from "styled-components/native";
import {TextStyle} from "../styles/Text";

export const Icon = styled(MaterialIcons)`
	${TextStyle};
	${props => css`
		${props.size && `font-size: ${props.size}px;`}
		${props.color && `color: ${props.color as string};`}
	`}
`;
