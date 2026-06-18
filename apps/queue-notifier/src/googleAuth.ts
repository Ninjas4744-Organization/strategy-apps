const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

export async function getGoogleAccessToken(
	clientEmail: string,
	privateKeyPem: string,
	fetcher: typeof fetch = fetch,
) {
	const issuedAt = Math.floor(Date.now() / 1000);
	const expiresAt = issuedAt + 3600;
	const header = {alg: "RS256", typ: "JWT"};
	const claimSet = {
		iss: clientEmail,
		scope: GOOGLE_SCOPE,
		aud: GOOGLE_TOKEN_URL,
		iat: issuedAt,
		exp: expiresAt,
	};
	const unsignedJwt = `${base64UrlJson(header)}.${base64UrlJson(claimSet)}`;
	const key = await importPrivateKey(privateKeyPem);
	const signature = await crypto.subtle.sign(
		"RSASSA-PKCS1-v1_5",
		key,
		new TextEncoder().encode(unsignedJwt),
	);
	const jwt = `${unsignedJwt}.${base64Url(new Uint8Array(signature))}`;
	const response = await fetcher(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: jwt,
		}),
	});

	if (!response.ok) {
		throw new Error(`Google token request failed with ${response.status}: ${await response.text()}`);
	}

	const data = await response.json() as {access_token?: string};

	if (!data.access_token) {
		throw new Error("Google token response did not include an access_token");
	}

	return data.access_token;
}

function base64UrlJson(value: unknown) {
	return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function base64Url(bytes: Uint8Array) {
	let binary = "";

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary)
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replaceAll("=", "");
}

async function importPrivateKey(privateKeyPem: string) {
	const keyData = privateKeyPem
		.replace(/\\n/g, "\n")
		.replace("-----BEGIN PRIVATE KEY-----", "")
		.replace("-----END PRIVATE KEY-----", "")
		.replace(/\s/g, "");
	const binary = atob(keyData);
	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index++) {
		bytes[index] = binary.charCodeAt(index);
	}

	return await crypto.subtle.importKey(
		"pkcs8",
		bytes,
		{
			name: "RSASSA-PKCS1-v1_5",
			hash: "SHA-256",
		},
		false,
		["sign"],
	);
}
