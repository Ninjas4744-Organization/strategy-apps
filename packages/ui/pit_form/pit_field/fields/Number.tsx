import {BasicInput} from "../../../components/BasicInput.tsx";
import {Subtitle} from "../../../styles";

interface NumberFieldProps {
	value: string;
	onChange: (value: string) => void;
	title: string;
	description?: string;
}

export const NumberField = ({value, onChange, title, description}: NumberFieldProps) => {
	return (
		<>
			<Subtitle>{title}</Subtitle>
			<BasicInput value={value} onChangeText={onChange} label={description} keyboardType="numeric" />
		</>
	);
}