import {Colors} from "../styles/colors";
import {Team} from "../../models/Team";

export const chartConfig = {
	color: () => Colors.white,
	backgroundGradientFromOpacity: 0,
	backgroundGradientToOpacity: 0,
};

export type AdminTabProps = {
	team: Team,
}
