#!/usr/bin/env node
import {spawn} from "node:child_process";
import {connect} from "node:net";

const firebaseEmulatorHost = "127.0.0.1";
const firebaseEmulatorPorts = {
	auth: process.env.FIREBASE_AUTH_EMULATOR_PORT ?? "9099",
	firestore: process.env.FIRESTORE_EMULATOR_PORT ?? "4744",
	ui: process.env.FIREBASE_EMULATOR_UI_PORT ?? "4000",
};

function spawnBun(args) {
	return spawn("bun", args, {
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

async function waitForEmulators() {
	const requiredPorts = [
		["Firebase Auth", firebaseEmulatorPorts.auth],
		["Firestore", firebaseEmulatorPorts.firestore],
		["Firebase Emulator UI", firebaseEmulatorPorts.ui],
	];

	for (const [name, port] of requiredPorts) {
		if (!await waitForPort(firebaseEmulatorHost, port)) {
			throw new Error(`${name} did not become reachable on ${firebaseEmulatorHost}:${port}.`);
		}
	}
}

let shuttingDown = false;
const children = new Set();

function track(child) {
	children.add(child);
	child.on("exit", () => children.delete(child));
	return child;
}

function shutdown(signal = "SIGTERM") {
	if (shuttingDown) {
		return;
	}

	shuttingDown = true;

	for (const child of children) {
		child.kill(signal);
	}
}

process.once("SIGINT", () => {
	shutdown("SIGINT");
	setTimeout(() => process.exit(130), 2000);
});
process.once("SIGTERM", () => {
	shutdown("SIGTERM");
	setTimeout(() => process.exit(143), 2000);
});

const emulator = track(spawnBun(["tools/scripts/run-emulator-stack.mjs"]));
let expo = null;

emulator.on("exit", (code, signal) => {
	if (shuttingDown) {
		return;
	}

	if (expo) {
		shutdown("SIGTERM");
	}

	if (signal) {
		process.exit(signal === "SIGINT" ? 130 : 143);
	}

	process.exit(code ?? 0);
});

try {
	await waitForEmulators();

	if (shuttingDown) {
		process.exit(0);
	}

	console.log("Firebase emulators are ready. Starting Expo dev client for physical iPhone...");
	expo = track(spawnBun(["tools/scripts/run-expo-emulator.mjs", "iphone-dev-client"]));
	expo.on("exit", (code, signal) => {
		if (!shuttingDown) {
			shutdown("SIGTERM");
		}

		if (signal) {
			process.exit(signal === "SIGINT" ? 130 : 143);
		}

		process.exit(code ?? 0);
	});
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	shutdown("SIGTERM");
	process.exit(1);
}
