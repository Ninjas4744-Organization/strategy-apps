# Queue Notifier Worker

Cloudflare Worker for receiving Nexus live-event webhooks and notifying assigned scouters.

## Commands

From the repo root:

```bash
bun run queue-notifier:test
bun run queue-notifier:typecheck
bun run queue-notifier:dev
```

## Local Firebase Emulator

Create `apps/queue-notifier/.dev.vars`:

```env
FIREBASE_PROJECT_ID=scouting-app-3e18a
FIRESTORE_EMULATOR_HOST=127.0.0.1:4744
FIRESTORE_EMULATOR_AUTH_UID=local-worker-admin
NEXUS_WEBHOOK_TOKEN=local-test-token
```

No Firebase service account is needed when the Worker points at the local Firestore emulator.
The auth UID must have a matching emulator document at `users/local-worker-admin`
with `type: "app_admin"` so Firestore rules allow it to read assignments and tokens.

Run the Firebase emulator/dev-client stack in one terminal, then the Worker in another:

```bash
bun run dev:scouter:dev-client:iphone
bun run queue-notifier:dev
```

## Required Worker Secrets

Set these before deploying:

```bash
bunx wrangler secret put FIREBASE_CLIENT_EMAIL --cwd apps/queue-notifier
bunx wrangler secret put FIREBASE_PRIVATE_KEY --cwd apps/queue-notifier
bunx wrangler secret put NEXUS_WEBHOOK_TOKEN --cwd apps/queue-notifier
```

`FIREBASE_PROJECT_ID` is currently configured in `wrangler.toml`.

## Local Webhook Test

With `wrangler dev` running:

```bash
curl -i \
  -X POST http://localhost:8787/nexus/live-event \
  -H 'Content-Type: application/json' \
  -H 'Nexus-Token: local-test-token' \
  --data @apps/queue-notifier/samples/live-event-now-queuing.json
```

If you replay the same sample, bump `dataAsOfTime` in the sample payload or delete the
`nexusEventStates/2025isde1` document in the emulator UI.

## Local Manual Notification Test

Use this when a scouter is already assigned and you want to confirm their registered device receives pushes:

```bash
curl -i \
  -X POST http://localhost:8787/admin/test-notification \
  -H 'Content-Type: application/json' \
  -H 'Nexus-Token: local-test-token' \
  --data '{"eventId":"2025isde1","assignmentId":"match-24-team-4744"}'
```

This sends a clearly marked test notification and does not update the assignment's Nexus notification state.
