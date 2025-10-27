import {MaterialIcons} from "@expo/vector-icons";

type MaterialIcon = keyof typeof MaterialIcons.glyphMap;

export type BreakdownStat = {
	label: string;
	value: number|string;
	note?: string;
	color: string;
};

export type ExtraBreakdownStat = {
	color: string;
	icon: MaterialIcon;
	text: string;
};
