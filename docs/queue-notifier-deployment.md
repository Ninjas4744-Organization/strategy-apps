# Queue Notifier Deployment

This runbook deploys the Cloudflare Worker that receives `frc.nexus` live-event payloads and sends assignment notifications.

## Production Shape

- Firestore remains the source of truth for users, assignments, and push tokens.
- Cloudflare Workers only receive Nexus payloads and send notification requests.
- The Worker uses a dedicated Firebase service account for Firestore REST access.
- Expo push is the current production-ready send path for this app build.
- Native FCM sending is still a future step.

## Firebase Service Account

Create a dedicated service account for the Worker. Do not use an owner/admin key.

Suggested name:

```text
queue-notifier-worker
```

For the current Expo push path, the service account only needs Firestore document access. Add FCM permissions later only when native FCM sending is implemented and tested.

After creating the service account:

1. Create a JSON key for the service account.
2. Copy `client_email`.
3. Copy `private_key`.
4. Store the JSON file somewhere temporary only while setting Cloudflare secrets.
5. Delete the local JSON file after the secrets are set.

## Cloudflare Secrets

From the repo root:

```bash
bunx wrangler secret put FIREBASE_CLIENT_EMAIL --cwd apps/queue-notifier
bunx wrangler secret put FIREBASE_PRIVATE_KEY --cwd apps/queue-notifier
bunx wrangler secret put NEXUS_WEBHOOK_TOKEN --cwd apps/queue-notifier
```

`FIREBASE_PRIVATE_KEY` should be stored as a base64-encoded private key, for example by running `btoa(privateKey)` before saving the secret. The Worker reads that value with `atob`. This is encoding for safer pasting, not encryption. The Worker also accepts the raw private key if needed.

Use a long random value for `NEXUS_WEBHOOK_TOKEN`, then give that same value to Nexus as the webhook token.

## Deploy

Run the checks first:

```bash
bun run queue-notifier:test
bun run queue-notifier:typecheck
```

Deploy:

```bash
bun run queue-notifier:deploy
```

Then verify the deployed health route:

```bash
curl -i https://YOUR_WORKER_URL/health
```

## Production Smoke Test

Use an existing assignment whose scouter has an active token:

```bash
curl -i \
  -X POST https://YOUR_WORKER_URL/admin/test-notification \
  -H 'Content-Type: application/json' \
  -H 'Nexus-Token: YOUR_NEXUS_WEBHOOK_TOKEN' \
  --data '{"eventId":"2025isde1","assignmentId":"match-24-team-4744"}'
```

This test endpoint sends a clearly marked notification and does not mark the assignment as notified.

## Nexus Webhook

Register this URL with Nexus:

```text
https://YOUR_WORKER_URL/nexus/live-event
```

Configure Nexus to send the same token stored in `NEXUS_WEBHOOK_TOKEN`.

Before competition, confirm that the Nexus `eventKey` exactly matches the Firestore event document id, for example:

```text
events/2025isde1
```

## Key Rotation

Rotate the Firebase service account key with this sequence:

1. Create a new JSON key on the same dedicated service account.
2. Update `FIREBASE_PRIVATE_KEY` in Cloudflare Worker secrets.
3. Redeploy the Worker.
4. Run the production smoke test.
5. Delete the old Firebase service account key.

Keep only one active key whenever practical.
