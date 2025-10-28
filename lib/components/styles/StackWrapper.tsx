import { LinearGradient } from "expo-linear-gradient";
import {MD2Colors} from "react-native-paper";

export const StackWrapper = ({children}: {children: React.ReactNode}) => <LinearGradient style={{flex: 1}} colors={[MD2Colors.indigo900, MD2Colors.blue900, MD2Colors.blue800]}>
	{children}
</LinearGradient>;
