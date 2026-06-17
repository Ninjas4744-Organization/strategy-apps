import {type ReactNode} from "react";
import {useColorScheme} from "react-native";
import {ThemeProvider as StyledThemeProvider} from "styled-components/native";

export type BuiltInThemeMode = "light" | "dark";

const typography = {
	fontFamily: {
		regular: "System",
		medium: "System",
		semiBold: "System",
		bold: "System",
	},
};

type BackgroundGradient = readonly [string, string, ...string[]];

export const lightTheme = {
	background: "transparent",
	backgroundGradient: ["#fbfaf7", "#e8f1f0", "#edf0fa", "#f7e9e3"] as BackgroundGradient,
	surface: "#ffffff",
	card: "#ffffff",
	text: "#1f2328",
	textMuted: "#6b7280",
	border: "#d1d5db",
	primary: "#5865f2",
	primaryText: "#ffffff",
	inputBackground: "#ebedef",
	danger: "#dc2626",
	success: "#16a34a",
	typography,
};

export const darkTheme = {
	background: "transparent",
	backgroundGradient: ["#101827", "#172033", "#26343f", "#2b2338"] as BackgroundGradient,
	surface: "#111827",
	card: "#1f2937",
	text: "#f9fafb",
	textMuted: "#9ca3af",
	border: "#374151",
	primary: "#3b82f6",
	primaryText: "#ffffff",
	inputBackground: "#1f2937",
	danger: "#ef4444",
	success: "#22c55e",
	typography,
};

export const appColors = {
	white: "#ffffff",
	black: "#000000",
	grey400: "#9ca3af",
	grey500: "#6b7280",
	grey600: "#4b5563",
	blue500: "#3b82f6",
	lightBlue500: "#0ea5e9",
	green500: "#22c55e",
	lightGreen500: "#84cc16",
	greenA200: "#69f0ae",
	red400: "#f87171",
	red500: "#ef4444",
	amber500: "#f59e0b",
	orange500: "#f97316",
	brown300: "#a78b71",
	purple500: "#8b5cf6",
	teal500: "#14b8a6",
};

export type AppTheme = typeof lightTheme;

declare module "styled-components/native" {
	export interface DefaultTheme extends AppTheme {}
}

declare module "styled-components/native/dist/models/ThemeProvider" {
	export interface DefaultTheme extends AppTheme {}
}

export const getAppTheme = (mode: BuiltInThemeMode) => (
	mode === "dark" ? darkTheme : lightTheme
);

export const useResolvedThemeMode = (): BuiltInThemeMode => {
	const colorScheme = useColorScheme();
	return colorScheme === "dark" ? "dark" : "light";
};

export const useThemeBundle = () => {
	const mode = useResolvedThemeMode();
	return {
		mode,
		appTheme: getAppTheme(mode),
	};
};

export const AppThemeProvider = ({
	children,
	theme,
}: {
	children: ReactNode;
	theme: AppTheme;
}) => (
	<StyledThemeProvider theme={theme}>
		{children}
	</StyledThemeProvider>
);
