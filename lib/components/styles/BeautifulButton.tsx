import {LinearGradient} from "expo-linear-gradient";
import styled from "styled-components/native";
import {MaterialIcons} from "@expo/vector-icons";
import {Icon} from "@/lib/components/Icon";
import {Text} from "./Text";
import {MD2Colors} from "react-native-paper";

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
	colors={[MD2Colors.green500, MD2Colors.greenA200]}
	start={{x: 0, y: 0}}
	end={{x: 1, y: 1}}
	style={{borderRadius: 16, margin: 8}}>
	<Button onPress={onPress}>
		<Icon name={icon} size={16} />
		<Text style={{fontSize: 16}}>{label}</Text>
	</Button>
</LinearGradient>;
