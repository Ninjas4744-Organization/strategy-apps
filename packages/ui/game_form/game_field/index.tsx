import type {ScoringElement} from "@ninjas-strategy/frc-games/types";
import {Counter} from "./fields/Couter";
import {Enum} from "./fields/Enum";
import {observer} from "mobx-react-lite";
import {BatchShooter} from "./fields/BatchShooter";
import {Adder} from "./fields/Adder";
import styled from "styled-components/native";
import {Subtitle} from "../../styles/Text";

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
			<CheckRow
				onPress={() => setData(id, !data[id])}
				$active={!!data[id]}
				$color={color}>
				<CheckMark $active={!!data[id]} $color={color} />
				<Subtitle style={{color: data[id] ? color : undefined}}>{title}</Subtitle>
			</CheckRow>
		);
	}
	return <></>;
});

const CheckRow = styled.Pressable<{ $active: boolean; $color: string }>`
	min-height: 48px;
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 8px 10px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${({$active, $color, theme}) => $active ? $color : theme.border};
	background-color: ${({$active, $color}) => $active ? `${$color}20` : "transparent"};
`;

const CheckMark = styled.View<{ $active: boolean; $color: string }>`
	width: 22px;
	height: 22px;
	border-radius: 6px;
	border-width: 2px;
	border-color: ${({$color}) => $color};
	background-color: ${({$active, $color}) => $active ? $color : "transparent"};
`;
