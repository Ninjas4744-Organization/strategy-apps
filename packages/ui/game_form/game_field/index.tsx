import type {ScoringElement} from "@ninjas-strategy/frc-games/types";
import {Counter} from "./fields/Couter";
import {Enum} from "./fields/Enum";
import {observer} from "mobx-react-lite";
import {Checkbox, MD2Colors} from "react-native-paper";
import {BatchShooter} from "./fields/BatchShooter";
import {Adder} from "./fields/Adder";

type GameFieldProps = ScoringElement & {
	id: string;
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
	pageNum: number;
};

export const GameField = observer(({type, title, color, data, id, missed_key, adderValues = [], setData, values, pageNum}: GameFieldProps) => {
	if (type === 'batch-shooter') {
		return (
			<BatchShooter
				value={data[id]}
				onChange={v => setData(id, v)}
				title={title}
				pageNum={pageNum} />
		);
	}
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
	if (type === 'adder') {
		return (
			<Adder
				title={title}
				color={color}
				value={data[id]}
				onChange={(value) => setData(id, value)}
				values={adderValues} />
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
	if (type === 'bool') {
		return (
			<Checkbox.Item
				status={data[id] ? 'checked' : 'unchecked'}
				label={title}
				onPress={() => setData(id, !data[id])}
				color={color}
				labelStyle={{color: data[id] ? color : MD2Colors.white}}
				uncheckedColor={MD2Colors.white}
				mode="android" />
		);
	}
	return <></>;
});
