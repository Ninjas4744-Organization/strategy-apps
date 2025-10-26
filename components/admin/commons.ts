import {Team} from "../../models/Team";
import {MD2Colors} from "react-native-paper";

export const chartConfig = {
	color: () => MD2Colors.white,
	backgroundGradientFromOpacity: 0,
	backgroundGradientToOpacity: 0,
};

export type AdminTabProps = {
	team: Team,
}
