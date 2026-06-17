#!/usr/bin/env node
import {spawn, spawnSync} from "node:child_process";
import {existsSync} from "node:fs";
import {connect} from "node:net";

const projectId = "scouting-app-3e18a";
const emulatorDataDir = ".firebase/emulator-data";
const firebaseEmulatorHost = "127.0.0.1";
const firebaseEmulatorPorts = {
	auth: process.env.FIREBASE_AUTH_EMULATOR_PORT ?? "9099",
	firestore: process.env.FIRESTORE_EMULATOR_PORT ?? "4744",
	ui: process.env.FIREBASE_EMULATOR_UI_PORT ?? "4000",
};
const extraArgs = process.argv.slice(2);
const shouldExportOnExit =
	process.env.FIREBASE_EMULATOR_EXPORT_ON_EXIT === "1" ||
	(process.platform !== "win32" && process.env.FIREBASE_EMULATOR_EXPORT_ON_EXIT !== "0");

function stopStaleEmulators() {
	spawnSync("bun", ["tools/scripts/stop-emulators.mjs"], {
		stdio: "inherit",
		shell: process.platform === "win32",
	});
}

function waitForPort(host, port, timeoutMs = 30000) {
	const startedAt = Date.now();

	return new Promise((resolve) => {
		function tryConnect() {
			const socket = connect({host, port: Number(port)});

			socket.once("connect", () => {
				socket.end();
				resolve(true);
			});
			socket.once("error", () => {
				socket.destroy();

				if (Date.now() - startedAt >= timeoutMs) {
					resolve(false);
					return;
				}

				setTimeout(tryConnect, 500);
			});
		}

		tryConnect();
	});
}

if (extraArgs.length > 0) {
	console.error("emulator:run starts Firebase emulators only.");
	console.error("Start Expo separately with one of: bun run dev:scouter:emulator, bun run dev:scouter:emulator:ios, bun run dev:scouter:emulator:android.");
	process.exit(1);
}

const emulatorArgs = [
	"emulators:start",
	"--project",
	projectId,
];

if (shouldExportOnExit) {
	emulatorArgs.push("--export-on-exit", emulatorDataDir);
}

if (existsSync(emulatorDataDir)) {
	emulatorArgs.push("--import", emulatorDataDir);
}

if (process.platform === "win32" && !shouldExportOnExit) {
	console.log("Skipping automatic emulator export on Windows. Set FIREBASE_EMULATOR_EXPORT_ON_EXIT=1 to force it.");
}

stopStaleEmulators();

const child = spawn("firebase", emulatorArgs, {
	stdio: "inherit",
	shell: process.platform === "win32",
});

let shuttingDown = false;
let firebaseExited = false;

async function shutdown(signal) {
	if (shuttingDown) {
		return;
	}

	shuttingDown = true;
	child.kill(signal);

	setTimeout(() => {
		stopStaleEmulators();
		process.exit(signal === "SIGINT" ? 130 : 143);
	}, 2000);
}

async function runInitialSeed() {
	const requiredPorts = [
		["Firebase Auth", firebaseEmulatorPorts.auth],
		["Firestore", firebaseEmulatorPorts.firestore],
		["Firebase Emulator UI", firebaseEmulatorPorts.ui],
	];

	for (const [name, port] of requiredPorts) {
		if (!await waitForPort(firebaseEmulatorHost, port)) {
			console.error(`${name} did not become reachable on ${firebaseEmulatorHost}:${port}.`);
			await shutdown("SIGTERM");
			return;
		}
	}

	if (firebaseExited || shuttingDown) {
		return;
	}

	const seed = spawnSync(
		"bun",
		["tools/scripts/with-firebase-emulator-env.mjs", "node", "scripts/seed-firebase-emulator.mjs"],
		{
			stdio: "inherit",
			shell: process.platform === "win32",
		},
	);

	if (seed.error) {
		console.error(seed.error);
		await shutdown("SIGTERM");
		return;
	}

	if (seed.status !== 0) {
		await shutdown("SIGTERM");
		return;
	}

	console.log(`Firebase Emulator UI is available at http://${firebaseEmulatorHost}:${firebaseEmulatorPorts.ui}`);
	console.log("Start Expo separately with `bun run dev:scouter:emulator`. Press Ctrl+C to stop the emulator stack.");
}

process.once("SIGINT", () => {
	void shutdown("SIGINT");
});
process.once("SIGTERM", () => {
	void shutdown("SIGTERM");
});

child.on("exit", (code, signal) => {
	firebaseExited = true;

	if (signal) {
		stopStaleEmulators();
		process.exit(signal === "SIGINT" ? 130 : 143);
		return;
	}

	stopStaleEmulators();
	process.exit(code ?? 0);
});

void runInitialSeed();
