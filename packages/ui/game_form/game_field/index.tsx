import type {ScoringElement} from "@ninjas-strategy/frc-games/types";
import {Counter} from "./fields/Couter";
import {Enum} from "./fields/Enum";
import {observer} from "mobx-react-lite";
import {BatchShooter} from "./fields/BatchShooter";
import {Adder} from "./fields/Adder";
import styled from "styled-components/native";
import {Subtitle} from "../../styles/Text";
import {Switch} from "../../components/Switch";

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
		const isActive = !!data[id];

		return (
			<CheckRow
				accessibilityRole="switch"
				accessibilityState={{checked: isActive}}
				onPress={() => setData(id, !isActive)}
			>
				<CheckCopy>
					<CheckLabel $active={isActive} $color={color}>{title}</CheckLabel>
				</CheckCopy>
				<Switch value={isActive} activeColor={color} pointerEvents="none" />
			</CheckRow>
		);
	}
	return <></>;
});

const CheckRow = styled.Pressable`
	min-height: 58px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 0;
`;

const CheckCopy = styled.View`
	flex: 1;
	min-width: 0;
`;

const CheckLabel = styled(Subtitle)<{ $active: boolean; $color: string }>`
	color: ${({theme, $active, $color}) => $active ? $color : theme.text};
	font-size: 16px;
	font-weight: 700;
`;
