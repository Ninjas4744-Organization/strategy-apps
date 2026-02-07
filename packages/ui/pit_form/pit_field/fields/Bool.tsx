import {Checkbox, MD2Colors} from "react-native-paper";

export const BoolField = ({label, value, onChange}) => {
	return (
		<Checkbox.Item
			status={value ? 'checked' : 'unchecked'}
			label={label}
			onPress={() => onChange(!value)}
			labelStyle={{color: MD2Colors.white}}
			uncheckedColor={MD2Colors.white}
			mode="android" />
	);
}