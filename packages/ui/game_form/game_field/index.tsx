import type {ScoringElement} from "@ninjas-strategy/frc-games/Game.ts";
import {Counter} from "./fields/Couter";
import {Enum} from "./fields/Enum";
import {observer} from "mobx-react-lite";

type GameFieldProps = ScoringElement & {
	id: string;
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

export const GameField = observer(({type, title, color, data, id, missed_key, setData, values}: GameFieldProps) => {
	if (type === 'counter') {
		return (
			<Counter
				title={title}
				color={color}
				missed={data[missed_key!] ?? 0}
				scored={data[id]}
				setMissed={(value) => setData(missed_key!, value)}
				setScored={(value) => setData(id, value)}/>
		);
	}
	if (type === 'enum') {
		return (
			<Enum
				value={data[id]}
				setValue={value => setData(id, value)}
				values={values || {}}
				color={color} />
		);
	}
	return <></>;
});
