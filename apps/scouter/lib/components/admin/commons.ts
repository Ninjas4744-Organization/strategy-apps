import {Team} from "@/lib/models/Team";
import {appColors} from "@ninjas-strategy/ui";

export const chartConfig = {
	color: () => appColors.white,
	backgroundGradientFromOpacity: 0,
	backgroundGradientToOpacity: 0,
};

export type AdminTabProps = {
	team: Team,
}
