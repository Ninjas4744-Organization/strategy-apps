import {BasicInput} from "../../../components/BasicInput.tsx";
import {Subtitle} from "../../../styles";

interface TextFieldProps {
	value: string;
	onChange: (value: string) => void;
	title: string;
	description?: string;
}

export const TextField = ({value, onChange, title, description}: TextFieldProps) => {
	return (
		<>
			<Subtitle>{title}</Subtitle>
			<BasicInput value={value} onChangeText={onChange} label={description} multiline={true} numberOfLines={4} />
		</>
	);
}