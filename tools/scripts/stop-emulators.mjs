#!/usr/bin/env node
import {execFileSync} from "node:child_process";

const PROJECT_ID = "scouting-app-3e18a";
const FIRESTORE_PORT = "4744";
const WINDOWS_EMULATOR_PORTS = ["4000", "4744", "9099"];

function getMatchingEmulatorPids() {
	if (process.platform === "win32") {
		return getWindowsPidsListeningOnPorts(WINDOWS_EMULATOR_PORTS);
	}

	const output = execFileSync("ps", ["-axo", "pid=,command="], {
		encoding: "utf8",
	});

	return output
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [pid, ...commandParts] = line.split(/\s+/);
			return {
				pid: Number(pid),
				command: commandParts.join(" "),
			};
		})
		.filter(isMatchingEmulatorProcess)
		.map(({pid}) => pid);
}

function getWindowsPidsListeningOnPorts(ports) {
	const output = execFileSync("netstat", ["-ano", "-p", "tcp"], {
		encoding: "utf8",
	});
	const portSet = new Set(ports.map(String));

	return [
		...new Set(
			output
				.split("\n")
				.map((line) => line.trim().split(/\s+/))
				.filter((parts) => parts.length >= 5)
				.filter(([protocol]) => protocol.toLowerCase() === "tcp")
				.filter(([, localAddress, , state]) =>
					portSet.has(localAddress.split(":").at(-1)) &&
					state.toUpperCase() === "LISTENING",
				)
				.map((parts) => Number(parts.at(-1)))
				.filter((pid) => Number.isInteger(pid) && pid !== process.pid),
		),
	];
}

function isMatchingEmulatorProcess({pid, command}) {
	return (
		Number.isInteger(pid) &&
		pid !== process.pid &&
		command.includes("cloud-firestore-emulator") &&
		command.includes(`--project_id ${PROJECT_ID}`) &&
		command.includes(`--port ${FIRESTORE_PORT}`)
	);
}

function killPid(pid, signal) {
	try {
		process.kill(pid, signal);
		return true;
	} catch {
		return false;
	}
}

async function wait(ms) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
	const pids = getMatchingEmulatorPids();

	if (pids.length === 0) {
		console.log("No stale Firebase emulator processes found.");
		return;
	}

	console.log(`Stopping stale Firebase emulator process${pids.length === 1 ? "" : "es"}: ${pids.join(", ")}`);

	for (const pid of pids) {
		killPid(pid, "SIGTERM");
	}

	await wait(1500);

	for (const pid of getMatchingEmulatorPids()) {
		killPid(pid, "SIGKILL");
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
