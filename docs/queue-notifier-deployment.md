# Queue Notifier Deployment

This runbook deploys the Cloudflare Worker that receives `frc.nexus` live-event payloads and sends assignment notifications.

Production Worker URL:

```text
https://the-ninja-scouter-notifier.kfiros.com
```

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

## Android Expo Push Credentials

Android notification delivery through Expo Push requires two Firebase pieces:

1. `apps/scouter/google-services.json`, referenced by `apps/scouter/app.json` as `expo.android.googleServicesFile`.
2. A private FCM V1 Google service account key uploaded to EAS credentials for the Android production profile.

The checked-in `google-services.json` is the public Firebase Android app config for package:

```text
com.ninjas4744.scouter
```

The FCM V1 key is private and must not be committed. If creating it manually, use Firebase Console or Google Cloud IAM to create/download a JSON key for a service account with the `Firebase Cloud Messaging API Admin` role.

Store the temporary local file as:

```text
apps/scouter/fcm-v1-service-account.json
```

That filename is ignored by git. Upload it with:

```bash
cd apps/scouter
eas credentials -p android
```

Choose the production build profile, then configure the FCM V1 Google service account key. Delete the local JSON file after EAS confirms it is uploaded.

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
  -X POST https://the-ninja-scouter-notifier.kfiros.com/admin/test-notification \
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

Current production URL:

```text
https://the-ninja-scouter-notifier.kfiros.com/nexus/live-event
```

Nexus sends a validation POST before saving the webhook. The Worker returns `200 OK` for token-valid validation probes even when the body is not a full live-event payload.

Configure Nexus to send the same token stored in `NEXUS_WEBHOOK_TOKEN`.

Nexus does not expose a separate "qualification schedule released" webhook type. The Worker detects schedule release from the live-event payload by watching for normal `Qualification N` matches to appear in the `matches` array for the first time.

When detected, the Worker creates the normal app event document if it does not already exist:

```text
events/{eventKey}
```

The document uses the same shape as admin-created events, including `teams` as `frc`-prefixed team keys such as `frc4744`. Nexus does not include full TBA event metadata in the live-event payload, so the Worker derives minimal event metadata from `eventKey` and the schedule payload.

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
