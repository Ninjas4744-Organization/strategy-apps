export const PRESENCE_SERVICE_UUID = "180D";
export type PresenceStatus = "available" | "game_scouting" | "pit_scouting" | "break";

const STATUS_TO_BYTE: Record<PresenceStatus, number> = {
	available: 0,
	game_scouting: 1,
	pit_scouting: 2,
	break: 3,
};

const BYTE_TO_STATUS: Record<number, PresenceStatus> = {
	0: "available",
	1: "game_scouting",
	2: "pit_scouting",
	3: "break",
};

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map(b => b.toString(16).padStart(2, "0"))
		.join("");
}

function hexToBytes(hex: string): Uint8Array | null {
	const clean = hex.trim().toLowerCase();
	if (clean.length % 2 !== 0) return null;
	const out = new Uint8Array(clean.length / 2);
	for (let i = 0; i < out.length; i++) {
		const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
		if (Number.isNaN(byte)) return null;
		out[i] = byte;
	}
	return out;
}

type PresenceParams = {
	status: PresenceStatus;
	shortId: number;     // 0..2^32-1
	teamNumber: number; // 0..65535
	matchNumber: number; // 0..65535
};

export function encodePresence(params: PresenceParams): string {
	const version = 1;
	const statusByte = STATUS_TO_BYTE[params.status] ?? 0;

	const team = Math.max(0, Math.min(65535, params.teamNumber | 0));
	const match = Math.max(0, Math.min(65535, (params.matchNumber || 0) | 0));
	const shortId = (params.shortId >>> 0);

	const bytes = new Uint8Array(1 + 1 + 4 + 4);
	bytes[0] = version;
	bytes[1] = statusByte;
	bytes[2] = (team >> 8) & 0xff;
	bytes[3] = (match >> 8) & 0xff;
	bytes[4] = team & 0xff;
	bytes[5] = match & 0xff;
	bytes[6] = (shortId >>> 24) & 0xff;
	bytes[7] = (shortId >>> 16) & 0xff;
	bytes[8] = (shortId >>> 8) & 0xff;
	bytes[9] = shortId & 0xff;

	return bytesToHex(bytes);
}

type DecodedPresence = PresenceParams & {
	version: number;
};

export function decodePresence(hex: string): null | DecodedPresence {
	const bytes = hexToBytes(hex);
	if (!bytes || bytes.length < 10) return null;

	const version = bytes[0];
	const status = BYTE_TO_STATUS[bytes[1]] ?? "available";
	const teamNumber = (bytes[2] << 8) | bytes[4];
	const matchNumber = (bytes[3] << 8) | bytes[5];
	const shortId =
		(bytes[6] << 24) |
		(bytes[7] << 16) |
		(bytes[8] << 8) |
		bytes[9];

	return { version, status, teamNumber, matchNumber, shortId: shortId >>> 0 };
}
