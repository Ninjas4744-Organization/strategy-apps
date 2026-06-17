import {ScrollViewStyleReset} from "expo-router/html";
import type {PropsWithChildren} from "react";

const title = "The Ninja Scouter";
const lightGradient = "linear-gradient(135deg, #fbfaf7, #e8f1f0, #edf0fa, #f7e9e3)";
const darkGradient = "linear-gradient(135deg, #101827, #172033, #26343f, #2b2338)";
const lightThemeColor = "#fbfaf7";
const darkThemeColor = "#101827";

export default function RootHtml({children}: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8"/>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>
				<ScrollViewStyleReset/>
				<style
					id="app-background"
					dangerouslySetInnerHTML={{
						__html: `
							html,
							body,
							#root,
							#root > div,
							body > div {
								min-height: 100vh !important;
								background: ${lightGradient} !important;
							}

							body {
								margin: 0 !important;
							}

							@media (prefers-color-scheme: dark) {
								html,
								body,
								#root,
								#root > div,
								body > div {
									background: ${darkGradient} !important;
								}
							}
						`,
					}}
				/>

				<meta name="application-name" content={title}/>
				<meta name="apple-mobile-web-app-title" content={title}/>
				<meta name="apple-mobile-web-app-capable" content="yes"/>
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content={lightThemeColor}/>
				<meta name="theme-color" media="(prefers-color-scheme: dark)" content={darkThemeColor}/>
			</head>
			<body>{children}</body>
		</html>
	);
}
