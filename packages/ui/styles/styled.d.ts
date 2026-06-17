import "styled-components/native";
import "styled-components/native/dist/models/ThemeProvider";
import type {AppTheme} from "./theme";

declare module "styled-components/native" {
	export interface DefaultTheme extends AppTheme {}
}

declare module "styled-components/native/dist/models/ThemeProvider" {
	export interface DefaultTheme extends AppTheme {}
}
