#!/usr/bin/env node
import {spawn} from "node:child_process";

const [command, ...args] = process.argv.slice(2);

if (!command) {
	console.error("Usage: bun tools/scripts/with-firebase-emulator-env.mjs <command> [...args]");
	process.exit(1);
}

const env = {
	...process.env,
	FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:4744",
	FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099",
	FIREBASE_EMULATOR_HOST: process.env.FIREBASE_EMULATOR_HOST ?? "127.0.0.1",
	FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "scouting-app-3e18a",
};

const child = spawn(command, args, {
	env,
	stdio: "inherit",
	shell: process.platform === "win32",
});

child.on("error", (error) => {
	console.error(error);
	process.exit(1);
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});
