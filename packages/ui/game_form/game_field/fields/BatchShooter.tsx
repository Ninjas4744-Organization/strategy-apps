import React from "react";
import {View} from "react-native";
import styled from "styled-components/native";
import {CounterValue} from "./Couter";
import {appColors} from "../../../styles";
import {Icon, Text} from "../../..";
import Animated, {LinearTransition} from "react-native-reanimated";

export type ShooterBatch = {
	shotPct: number;
	missCount: number;
	pageNum: number;
	batchNumber: number;
};

type BatchShooterProps = {
	value: ShooterBatch[];
	onChange: (next: ShooterBatch[]) => void;
	title: string;
	pageNum: number;
	shotPresets?: number[];
};

const Container = styled.View`
	gap: 10px;
	color: ${appColors.white};
`;
const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LayoutText = styled.Text`
	color: ${appColors.white};
`;
const Label = styled(LayoutText)`font-size: 16px; font-weight: 800;`;
const SmallNote = styled(LayoutText)`font-size: 12px; opacity: 0.7;`;

const Button = styled.Pressable`
	padding: 8px 12px;
	border-color: ${appColors.white}50;
	border-radius: 10px;
	border-width: 1px;
`;

const LayoutCard = styled(Animated.View)`
	border-width: 1px;
	border-radius: 14px;
	padding: 12px;
	gap: 10px;
	border-color: ${appColors.white}50;
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
	border-color: ${appColors.white}50;
	color: ${appColors.white};
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
	border-color: ${appColors.white}50;
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

export const BatchShooter = ({value, onChange, title, pageNum, shotPresets = [0, 25, 50, 75, 100]}: BatchShooterProps) => {
	const [openedBatch, setOpenedBatch] = React.useState<number | null>(null);
	let batches = value || [];
	batches = batches.filter(b => b.pageNum === pageNum);

	const add = () => {
		const batchNumber = batches.length;
		onChange([...batches, {shotPct: 0, missCount: 0, batchNumber, pageNum}]);
		setOpenedBatch(batchNumber);
	};
	const remove = (i: number) => onChange(batches.filter(({batchNumber}) => batchNumber !== i));
	const update = (i: number, next: Partial<ShooterBatch>) => onChange(batches.map((b) => (b.batchNumber === i ? ({
		...b,
		...next,
	}) : b)));

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

			{batches.sort((a, b) => b.batchNumber - a.batchNumber).map((b, i) => (
				<LayoutCard key={i} layout={LinearTransition}>
					<HeaderRow>
						<Label>Batch #{b.batchNumber + 1}{openedBatch === b.batchNumber ? '' : `: ${b.shotPct ?? 0}% ${b.missCount ?? 0} Misses`}</Label>
						{openedBatch !== b.batchNumber && <Button onPress={() => setOpenedBatch(b.batchNumber)}>
							<Icon name="edit" />
						</Button>}
						<Button onPress={() => remove(b.batchNumber)}>
							<Icon name="remove" />
						</Button>
					</HeaderRow>

					{openedBatch === b.batchNumber && <LayoutRow>
						<LayoutCol>
							<LayoutTitle>% Shot (of box)</LayoutTitle>

							<InputRow>
								<NumberInput
									keyboardType="numeric"
									value={String(b.shotPct ?? 0)}
									onChangeText={(t) => update(b.batchNumber, {shotPct: parsePct(t), missCount: b.missCount ?? 0})} />
								<Percent>%</Percent>
							</InputRow>

							<PresetsRow>
								{shotPresets.map((p) => (
									<Chip
										key={`shot-${i}-${p}`}
										onPress={() => update(b.batchNumber, {shotPct: p, missCount: b.missCount ?? 0})}>
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
									onChangeText={(t) => update(b.batchNumber, {shotPct: b.shotPct ?? 0, missCount: parseIntSafe(t)})} />
							</InputRow>

							<PresetsRow>
								<CounterValue
									title="Misses"
									value={b.missCount}
									onChange={(v) => update(b.batchNumber, {shotPct: b.shotPct ?? 0, missCount: v})}
									color={appColors.white} />
							</PresetsRow>
						</LayoutCol>
					</LayoutRow>}
				</LayoutCard>
			))}
		</Container>
	);
};
