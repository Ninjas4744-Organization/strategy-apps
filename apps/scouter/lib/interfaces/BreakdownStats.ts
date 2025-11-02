import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

export type BreakdownStat = {
	icon?: MaterialIcon;
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
