export type TBAEventSimple = {
	key: string;
	name: string;
	event_code: string;
	event_type: number;
	city?: string | null;
	state_prov?: string | null;
	country?: string | null;
	start_date: string;
	end_date: string;
	year: number;
};
