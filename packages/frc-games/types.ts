import type {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {Game, Team} from "./calculations";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type FRCGame = {
	sections: ScoringSection[];
	fieldCalculations: Calculations;
	totalCalculations: Calculations;
	totalScore: string[];
	insights: Insight[];
	recommendations: Insight[];
	strengths: Insight[];
	weaknesses: Insight[];
	breakdownGraph: Stat<Team>[];
	gameCard: Stat<Game>[];
	performance: Stat<Team>[];
	scoreSummary: ScoreSummaryItem<Game>[];
	gameDetailedBreakdowns: BreakdownSection[];
}

export type ScoringSection = {
	id: string;
	title: string;
	color: string;
	icon: MaterialIcon;
	phase: 'autonomous' | 'teleop';
	fields: ScoringElements;
}

export type Calculations = {
	[key: string]: string[];
}

export type ScoringElement = {
	type: 'counter'|'enum'|'bool';
	title: string;
	color: string;
	getScore: (game: Record<string, any>) => number;
	missed_key?: string;				// counter
	values?: {[key: string]: string};	// enum
	defaultValue?: string;				// enum
}

type ScoringElements = {
	[key: string]: ScoringElement;
}

export type DisplayInsight = {
	message: string;
	description?: string;
	isPositive: boolean
}

export type Insight = {
	check: (team: Team) => boolean;
	text: string;
	isPositive?: boolean;
}

type Stat<T> = {
	label: string;
	val: (item: T) => number;
	color: string;
};

type ScoreSummaryItem<T> = Overwrite<Stat<T>, {
	label: (item: T) => string;
}>;

export type BreakdownSection = {
	title: string;
	stats: BreakdownStat<Game>[];
	extraStats: ExtraStat<Game>[];
};

export type BreakdownStat<T> = Stat<T> & {
	icon?: MaterialIcon;
	note: (item: T) => string;
};

export type ExtraStat<T> = {
	icon: MaterialIcon;
	label: (item: T) => string;
	color: string;
};

