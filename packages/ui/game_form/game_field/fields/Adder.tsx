import styled from "styled-components/native";
import {Icon, Subtitle} from "../../..";

type AdderProps = {
	title: string;
	color: string;
	value: number;
	onChange: (value: number) => void;
	values: number[];
};

const AdderContainer = styled.View<{ $themeColor: string }>`
	margin: 8px;
	padding: 12px;
	background-color: ${({theme}) => theme.inputBackground};
	gap: 16px;
	border-width: 1px;
	border-color: ${({$themeColor}) => $themeColor};
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
	background-color: ${({theme}) => theme.card};
	border: 1px solid ${({theme}) => theme.border};
	border-radius: 8px;
`;

export const Adder = ({title, color, value, onChange, values}: AdderProps) => {
	return (
		<AdderContainer $themeColor={color}>
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
