import { LinearGradient } from "expo-linear-gradient";

export const StackWrapper = ({children}: {children: React.ReactNode}) => <LinearGradient style={{flex: 1}} colors={['#1A237E', '#0D47A1', '#1565C0']}>
	{children}
</LinearGradient>;
