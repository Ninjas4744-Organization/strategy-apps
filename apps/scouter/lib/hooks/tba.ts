import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const TBA_BASE = "https://www.thebluealliance.com/api/v3";

export const TBA = (endpoint: string) => axios.get(`${TBA_BASE}${endpoint}`, {
	headers: {
		'X-TBA-Auth-Key': process.env.EXPO_PUBLIC_TBA_API_KEY,
	}
});

export const useTBA = (endpoint: string) => {
	return useQuery({
		queryKey: ['tba' + endpoint],
		queryFn: () => TBA(endpoint),
	});
};
