import {LinearGradient} from "expo-linear-gradient";
import styled from "styled-components/native";
import {MaterialIcons} from "@expo/vector-icons";
import {Icon} from "../Icon";
import {Text} from "./Text";

type MaterialIcon = keyof typeof MaterialIcons.glyphMap;

type BeautifulButtonProps = {
	label: string;
	icon: MaterialIcon;
	onPress: () => void;
};

const Button = styled.TouchableOpacity`
	height: 48px;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 12px;
`;

export const BeautifulButton = ({label, icon, onPress}: BeautifulButtonProps) => <LinearGradient
	colors={['#4CAF50FF', '#69F0AEFF']}
	start={{x: 0, y: 0}}
	end={{x: 1, y: 1}}
	style={{borderRadius: 16, margin: 8}}>
	<Button onPress={onPress}>
		<Icon name={icon} size={16} />
		<Text style={{fontSize: 16}}>{label}</Text>
	</Button>
</LinearGradient>;
