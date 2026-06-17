import {useWindowDimensions, type ViewProps} from "react-native";
import styled from "styled-components/native";
import {useTheme} from "styled-components/native";
import {LinearGradient} from "expo-linear-gradient";

const GradientBackground = styled(LinearGradient)<{$viewportHeight: number}>`
	flex: 1;
	min-height: ${({$viewportHeight}) => `${$viewportHeight}px`};
	width: 100%;
`;

const Content = styled.View<{$viewportHeight: number}>`
	flex: 1;
	min-height: ${({$viewportHeight}) => `${$viewportHeight}px`};
	width: 100%;
`;

export const StackWrapper = ({children, style, ...props}: ViewProps) => {
	const theme = useTheme();
	const {height} = useWindowDimensions();

	return (
		<GradientBackground
			{...props}
			$viewportHeight={height}
			colors={theme.backgroundGradient}
			start={{x: 0, y: 0}}
			end={{x: 1, y: 1}}
			style={[{minHeight: height, backgroundColor: 'transparent'}, style]}>
			<Content $viewportHeight={height}>
				{children}
			</Content>
		</GradientBackground>
	);
};
