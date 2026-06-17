export const sandboxUserPassword = "password123";

export type SandboxUser = {
	email: string;
	displayName: string;
	role: string;
	team: number;
};

export const sandboxUsers: SandboxUser[] = [
	{
		email: "app-admin@ninja.local",
		displayName: "Ninja App Admin",
		role: "App admin",
		team: 4744,
	},
	{
		email: "admin@ninja.local",
		displayName: "Ninja Team Admin",
		role: "Team admin",
		team: 4744,
	},
	{
		email: "scouter@ninja.local",
		displayName: "Ninja Scouter",
		role: "Scouter",
		team: 4744,
	},
	{
		email: "other-team@ninja.local",
		displayName: "Other Team Scouter",
		role: "Scouter",
		team: 1690,
	},
];
