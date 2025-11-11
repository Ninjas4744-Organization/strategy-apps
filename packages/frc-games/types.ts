import type {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {Game, Team} from "./calculations";

export type FRCGame = {
	sections: ScoringSection[];
	fieldCalculations: Calculations;
	totalCalculations: Calculations;
	totalScore: string[];
	insights: Insight[];
	recommendations: Insight[];
	strengths: Insight[];
	weaknesses: Insight[];
	breakdownGraph: BreakdownValue[];
	gameCard: GameCardValue[];
	scoreSummary: BreakdownValue[];
	breakdowns: BreakdownSection[];
	performance: BreakdownValue[];
}

export interface ScoringSection {
	id: string;
	title: string;
	color: string;
	icon: MaterialIcon;
	phase: 'autonomous' | 'teleop';
	fields: ScoringElements;
}

export interface Calculations {
	[key: string]: string[];
}

export interface ScoringElement {
	type: 'counter'|'enum'|'bool';
	title: string;
	color: string;
	getScore: (game: Record<string, any>) => number;
	missed_key?: string;				// counter
	values?: {[key: string]: string};	// enum
	defaultValue?: string;				// enum
}

interface ScoringElements {
	[key: string]: ScoringElement;
}

export type DisplayInsight = {
	message: string;
	description?: string;
	isPositive: boolean
}

export interface Insight {
	check: (team: Team) => boolean;
	text: string;
	isPositive?: boolean;
}

interface BreakdownValue {
	name: string;
	val: string;
	color: string;
}

interface GameCardValue {
	name: string;
	val: string;
}

interface BreakdownSection {
	title: string;
	stats: any;
	extraStats: any;
}

interface BreakdownStat {
	icon?: MaterialIcon;
	label: string;
	value: number|string;
	note?: string;
	color: string;
}

interface BreakdownExtraStat {
	color: string;
	icon: MaterialIcon;
	text: string;
}
