import styled from "styled-components/native";
import {Icon, Subtitle} from "../../..";
import {MD2Colors} from "react-native-paper";

type AdderProps = {
	title: string;
	color: string;
	value: number;
	onChange: (value: number) => void;
	values: number[];
};

const AdderContainer = styled.View<{ color: string, themeColor: string }>`
	margin: 8px;
	padding: 12px;
	background-color: ${props => props.color}50;
	gap: 16px;
	border-width: 1px;
	border-color: ${props => props.themeColor};
	border-radius: 12px;
	display: flex;
	flex-direction: column;
`;

const AdderHeader = styled.View`
    gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const AdderValuesRow = styled.View`
	display: flex;
	flex-direction: row;
`;

const AdderValueButton = styled.TouchableOpacity`
	padding: 8px;
	margin: 4px;
	background-color: ${MD2Colors.white}10;
	border: ${MD2Colors.white}20;
	border-radius: 8px;
`;

export const Adder = ({title, color, value, onChange, values}: AdderProps) => {
	return (
		<AdderContainer color={color} themeColor={color}>
			<AdderHeader>
				<Icon name="star" color={color} size={24} />
				<Subtitle>{title}</Subtitle>
			</AdderHeader>
			<AdderValuesRow>
				{values.map((val, index) => (
					<AdderValueButton key={index} onPress={() => onChange(value + val)}>
						<Subtitle>+{val}</Subtitle>
					</AdderValueButton>
				))}
			</AdderValuesRow>
		</AdderContainer>
	);
};
