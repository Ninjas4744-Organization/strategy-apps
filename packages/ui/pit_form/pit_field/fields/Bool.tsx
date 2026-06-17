import styled from "styled-components/native";
import {Subtitle} from "../../..";
import {Switch} from "../../../components/Switch";

export const BoolField = ({label, value, onChange}: {label: string; value: boolean; onChange: (value: boolean) => void}) => {
	const isActive = !!value;

	return (
		<Row
			accessibilityRole="switch"
			accessibilityState={{checked: isActive}}
			onPress={() => onChange(!isActive)}>
			<Copy>
				<Subtitle>{label}</Subtitle>
			</Copy>
			<Switch value={isActive} pointerEvents="none" />
		</Row>
	);
}

const Row = styled.Pressable`
	min-height: 58px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 0;
`;

const Copy = styled.View`
	flex: 1;
	min-width: 0;
`;
