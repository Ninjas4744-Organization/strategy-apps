import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export const useEventData = (eventKey: string) => {
	return useQuery({
		queryKey: ['event-' + eventKey],
		queryFn: () => axios.get('https://www.thebluealliance.com/api/v3/event/' + eventKey + '/simple', {
			headers: {
				'X-TBA-Auth-Key': process.env.EXPO_PUBLIC_TBA_API_KEY,
			}
		})
	});
}
