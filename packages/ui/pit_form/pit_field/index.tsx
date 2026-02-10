import type {PitAttribute} from "@ninjas-strategy/frc-games/types";
import {TextField} from "./fields/Text";
import {NumberField} from "./fields/Number";
import {BoolField} from "./fields/Bool";
import {Enum} from "./fields/Enum";
import {observer} from "mobx-react-lite";

type PitFieldProps = PitAttribute & {
	id: string;
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

export const PitField = observer(({type, id, title, description, values, data, setData}: PitFieldProps) => {
	switch (type) {
		case 'text':
			return <TextField value={data[id]} onChange={(value) => setData(id, value)} title={title} description={description} />;
		case 'bool':
			return <BoolField value={data[id]} onChange={(value: boolean) => setData(id, value)} label={title} />;
		case 'number':
			return <NumberField value={data[id]} onChange={(value) => setData(id, value)} title={title} description={description} />;
		case 'enum':
			return <Enum value={data[id]} onChange={(value: string) => setData(id, value)} values={values as {[key: string]: string}} title={title} />;
		default:
			return null;
	}
});
