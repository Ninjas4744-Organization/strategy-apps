import React from "react";
import {View} from "react-native";
import styled from "styled-components/native";
import {CounterValue} from "./Couter";
import {MD2Colors} from "react-native-paper";
import {Icon, Text} from "../../..";

export type ShooterBatch = {
	shotPct: number;
	missCount: number;
};

type BatchShooterProps = {
	value: ShooterBatch[];
	onChange: (next: ShooterBatch[]) => void;
	title: string;

	shotPresets?: number[];
};

const Container = styled.View`
	gap: 10px;
	color: ${MD2Colors.white};
`;
const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LayoutText = styled.Text`
	color: ${MD2Colors.white};
`;
const Label = styled(LayoutText)`font-size: 16px; font-weight: 800;`;
const SmallNote = styled(LayoutText)`font-size: 12px; opacity: 0.7;`;

const Button = styled.Pressable`
	padding: 8px 12px;
	border-color: ${MD2Colors.white}50;
	border-radius: 10px;
	border-width: 1px;
`;

const LayoutCard = styled.View`
	border-width: 1px;
	border-radius: 14px;
	padding: 12px;
	gap: 10px;
	border-color: ${MD2Colors.white}50;
`;

const LayoutRow = styled.View`flex-direction: row; gap: 10px; align-items: flex-start;`;
const LayoutCol = styled.View`flex: 1; gap: 6px;`;
const LayoutTitle = styled(Text)`font-size: 12px; font-weight: 800; opacity: 0.8;`;

const InputRow = styled.View`flex-direction: row; gap: 8px; align-items: center;`;
const NumberInput = styled.TextInput`
	flex: 1;
	border-width: 1px;
	border-radius: 12px;
	padding: 10px 12px;
	font-size: 16px;
	border-color: ${MD2Colors.white}50;
	color: ${MD2Colors.white};
`;
const Percent = styled(Text)`font-weight: 900; opacity: 0.8;`;

const PresetsRow = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;
const Chip = styled.Pressable`
	padding: 6px 10px;
	border-radius: 999px;
	border-width: 1px;
	border-color: ${MD2Colors.white}50;
`;
const ChipText = styled(Text)`
	font-weight: 800;
	font-size: 12px;
`;

function clampPct(n: number) {
	if (Number.isNaN(n)) return 0;
	return Math.max(0, Math.min(100, Math.round(n)));
}
function parsePct(text: string) {
	if (text.trim() === "") return 0;
	return clampPct(Number(text));
}
function clampInt(n: number) {
	if (Number.isNaN(n)) return 0;
	return Math.max(0, Math.floor(n));
}
function parseIntSafe(text: string) {
	if (text.trim() === "") return 0;
	return clampInt(Number(text));
}

export const BatchShooter = ({value, onChange, title, shotPresets = [0, 25, 50, 75, 100]}: BatchShooterProps) => {
	const batches = value || [];

	const add = () => onChange([...batches, {shotPct: 0, missCount: 0}]);
	const remove = (i: number) => onChange(batches.filter((_, idx) => idx !== i));
	const update = (i: number, next: ShooterBatch) => onChange(batches.map((b, idx) => (idx === i ? next : b)));

	return (
		<Container>
			<HeaderRow>
				<View>
					<Label>{title}</Label>
				</View>

				<Button onPress={add}>
					<Icon name="add" />
				</Button>
			</HeaderRow>

			{batches.length === 0 ? <SmallNote>No Batches Yet</SmallNote> : null}

			{batches.map((b, i) => (
				<LayoutCard key={i}>
					<HeaderRow>
						<Label>Batch #{i + 1}</Label>
						<Button onPress={() => remove(i)}>
							<Icon name="remove" />
						</Button>
					</HeaderRow>

					<LayoutRow>
						<LayoutCol>
							<LayoutTitle>% Shot (of box)</LayoutTitle>

							<InputRow>
								<NumberInput
									keyboardType="numeric"
									value={String(b.shotPct ?? 0)}
									onChangeText={(t) => update(i, {shotPct: parsePct(t), missCount: b.missCount ?? 0})} />
								<Percent>%</Percent>
							</InputRow>

							<PresetsRow>
								{shotPresets.map((p) => (
									<Chip
										key={`shot-${i}-${p}`}
										onPress={() => update(i, {shotPct: p, missCount: b.missCount ?? 0})}>
										<ChipText>{p}%</ChipText>
									</Chip>
								))}
							</PresetsRow>
						</LayoutCol>

						<LayoutCol>
							<LayoutTitle>Misses (count)</LayoutTitle>

							<InputRow>
								<NumberInput
									keyboardType="numeric"
									value={String(b.missCount ?? 0)}
									onChangeText={(t) => update(i, {shotPct: b.shotPct ?? 0, missCount: parseIntSafe(t)})} />
							</InputRow>

							<PresetsRow>
								<CounterValue
									title="Misses"
									value={b.missCount}
									onChange={(v) => update(i, {shotPct: b.shotPct ?? 0, missCount: v})}
									color={MD2Colors.white} />
							</PresetsRow>
						</LayoutCol>
					</LayoutRow>
				</LayoutCard>
			))}
		</Container>
	);
};
