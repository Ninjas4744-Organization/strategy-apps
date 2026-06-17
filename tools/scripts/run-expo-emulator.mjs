#!/usr/bin/env node
import {execFileSync, spawn} from "node:child_process";
import net from "node:net";
import os from "node:os";

const projectId = "scouting-app-3e18a";
const target = process.argv[2] ?? "start";
const passThroughArgs = process.argv.slice(3);
const targetArgs = {
	start: [],
	web: ["--web"],
	ios: ["--ios"],
	android: ["--android"],
	"android-device": [],
	iphone: ["--host", "lan"],
};

if (!targetArgs[target]) {
	console.error(`Unknown Expo emulator target "${target}". Use one of: ${Object.keys(targetArgs).join(", ")}`);
	process.exit(1);
}

function getLanHost() {
	if (process.platform === "win32") {
		const windowsHost = getWindowsLanHost();

		if (windowsHost) {
			return windowsHost;
		}
	}

	for (const addresses of Object.values(os.networkInterfaces())) {
		for (const address of addresses ?? []) {
			if (address.family === "IPv4" && !address.internal) {
				return address.address;
			}
		}
	}

	return "127.0.0.1";
}

function getWindowsLanHost() {
	try {
		const output = execFileSync("ipconfig", {encoding: "utf8"});
		const adapterBlocks = output.split(/\r?\n\r?\n/);

		for (const block of adapterBlocks) {
			if (!/Default Gateway[^\r\n]*:\s*\S+/m.test(block)) {
				continue;
			}

			const address = block.match(/IPv4 Address[^\r\n]*:\s*([0-9.]+)/)?.[1];

			if (address && !address.startsWith("127.")) {
				return address;
			}
		}
	} catch {
		return null;
	}

	return null;
}

const defaultHost =
	target === "android"
		? "10.0.2.2"
		: target === "iphone" || target === "android-device"
			? getLanHost()
			: "127.0.0.1";
const emulatorHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST ?? defaultHost;
const env = {
	...process.env,
	EXPO_PUBLIC_USE_FIREBASE_EMULATORS: "true",
	EXPO_PUBLIC_FIREBASE_EMULATOR_HOST: emulatorHost,
	EXPO_PUBLIC_FIREBASE_PROJECT_ID:
		process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? projectId,
	EXPO_PUBLIC_FIREBASE_API_KEY:
		process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "demo-api-key",
	EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
		process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
	EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
		process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`,
	EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
		process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
	EXPO_PUBLIC_FIREBASE_APP_ID:
		process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "1:000000000000:web:0000000000000000000000",
};

function canReachPort(host, port, timeoutMs = 500) {
	return new Promise((resolve) => {
		const socket = net.createConnection({host, port});
		const done = (reachable) => {
			socket.destroy();
			resolve(reachable);
		};

		socket.setTimeout(timeoutMs);
		socket.once("connect", () => done(true));
		socket.once("error", () => done(false));
		socket.once("timeout", () => done(false));
	});
}

console.log(`Using Firebase emulators at ${emulatorHost}`);
if (target === "iphone" || target === "android-device") {
	console.log(`Device check: open http://${emulatorHost}:9099/ on the device before logging in.`);
}

const shouldRequireReachableEmulator = target === "iphone" || target === "android-device";
const canReachAuthEmulator = target === "android" || await canReachPort(emulatorHost, 9099);

if (!canReachAuthEmulator) {
	const message = [
		`Auth emulator is not reachable at ${emulatorHost}:9099.`,
		"Start it in a separate terminal with `bun run emulator:run` or `bun run emulators`.",
		`For a physical device, Safari on the device should be able to open http://${emulatorHost}:9099/ before login will work.`,
	];

	if (shouldRequireReachableEmulator) {
		console.error(message.join("\n"));
		process.exit(1);
	}

	console.warn(`Warning: ${message.join("\n")}`);
}

const child = spawn("node", ["../../node_modules/.bin/expo", "start", ...targetArgs[target], ...passThroughArgs], {
	cwd: "apps/scouter",
	env,
	stdio: "inherit",
	shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});
