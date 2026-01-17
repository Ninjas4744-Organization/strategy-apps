import type {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";
import {Game, Team} from "./calculations";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type FRCGame = {
	sections: Sections;
	pages: Page[];
	fieldCalculations: Calculations;
	amountCalculations: Calculations;
	totalCalculations: Calculations;
	totalScore: string[];
	mainPageSections: MainPageSection[];
	insights: Insight[];
	recommendations: Insight[];
	strengths: Insight[];
	weaknesses: Insight[];
	breakdownGraph: NumberStat<Team>[];
	gameCard: Stat<Game>[];
	performance: NumberStat<Team>[];
	scoreSummary: ScoreSummaryItem<Game>[];
	gameDetailedBreakdowns: BreakdownSection<Game>[];
	teamDetailedBreakdowns: BreakdownSection<Team>[];
};

export type Page = {
	title: string;
	description: string;
	icon: MaterialIcon;
	phase: Phase;
	sections: (game: Record<string, any>) => string[];
};

export type ScoringSection = {
	id: string;
	title: string;
	color: string;
	icon: MaterialIcon;
	fields: ScoringElements;
};

export type Sections = {
	[key: string]: ScoringSection;
};

export type Calculations = {
	[key: string]: string[];
};

export type ScoringElement = {
	type: 'counter'|'enum'|'bool';
	title: string;
	description?: string;
	color: string;
	getScore: (game: Record<string, any>) => number;
	missed_key?: string;				// counter
	values?: {[key: string]: string};	// enum
	defaultValue?: string;				// enum
};

type ScoringElements = {
	[key: string]: ScoringElement;
};

export type DisplayInsight = {
	message: string;
	description?: string;
	isPositive: boolean
};

export type Insight = {
	check: (team: Team) => boolean;
	text: string;
	isPositive?: boolean;
};

type Stat<T> = {
	label: string;
	val: (item: T) => string;
	color: string;
};

type NumberStat<T> = Overwrite<Stat<T>, {val: (item: T) => number}>;

type ScoreSummaryItem<T> = Overwrite<Stat<T>, {
	label: (item: T) => string;
}>;

export type BreakdownSection<T> = {
	title: string;
	stats: BreakdownStat<T>[];
	extraStats: ExtraStat<T>[];
	itemsPerRow?: number;
};

export type BreakdownStat<T> = Stat<T> & {
	icon?: MaterialIcon;
	note?: (item: T) => string;
};

export type ExtraStat<T> = {
	icon: MaterialIcon;
	label: (item: T) => string;
	color: string;
};

export type Phase = 'autonomous' | 'teleop' | 'endgame';

type MainPageSection = {
	title: string;
	description: string;
	cards: DisplayStatCard[];
};

type DisplayStatCard = {
	label: string;
	icon: MaterialIcon;
	val: (data: Team) => string | number;
	color: string;
};

