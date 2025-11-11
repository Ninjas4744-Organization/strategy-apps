import type {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

export type Game = {
	sections: ScoringSection[];
	fieldCalculations: Calculations;
	totalCalculations: Calculations;
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

interface Calculations {
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

interface Insight {
	text: string;
	deps: string[];
	make: (data: Record<string, any>, ...deps: string[]) => string;
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
