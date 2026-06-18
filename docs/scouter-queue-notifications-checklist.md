# Scouter Queue Notifications Checklist

This checklist tracks the plan for notifying assigned scouters when their assigned team is queueing. The intended architecture is Firebase-first: Firestore remains the source of truth, Firebase Cloud Messaging sends notifications, and Cloudflare Workers are used only as a small Nexus webhook handler.

## Architecture

- [ ] Keep assignments, users, tokens, events, and future robot images in Firebase.
- [ ] Use Cloudflare Workers only for receiving Nexus webhook calls and dispatching notification work.
- [ ] Use Firestore as the only app database.
- [ ] Use Firebase Cloud Messaging for device notifications.
- [ ] Avoid Firebase Cloud Functions for this feature.
- [ ] Confirm whether the official event key in Nexus matches the app's existing Firestore `events/{eventId}` document id.

## Firestore Data Model

- [ ] Add `events/{eventId}/assignments/{assignmentId}`.
- [ ] Store assignment fields: `teamNumber`, `matchLabel`, `matchNumber`, `scouterId`, `scouterName`, `createdBy`, `createdAt`, `updatedAt`, `notifiedAt`.
- [ ] Store Nexus delivery fields: `lastNexusStatus`, `nexusDataAsOfTime`, `notificationResult`, `notificationError`.
- [ ] Add `users/{uid}/messagingTokens/{tokenId}`.
- [ ] Store token fields: `token`, `platform`, `appVersion`, `createdAt`, `updatedAt`, `disabledAt`.
- [ ] Decide whether assignments are keyed by generated ids, match labels, or `{match}-{team}-{scouter}` deterministic ids.
- [ ] Add enough fields to query unnotified assignments by event and team without expensive client-side filtering.

## App Notification Setup

- [ ] Add notification client dependency and configuration.
- [ ] Configure Android Firebase file: `google-services.json`.
- [ ] Configure iOS Firebase/APNs setup if students will use iPhones.
- [ ] Request notification permission after sign-in or onboarding.
- [ ] Fetch the device FCM token.
- [ ] Write the token to `users/{uid}/messagingTokens/{tokenId}`.
- [ ] Refresh/update the token when it changes.
- [ ] Disable or delete the current device token on sign-out when practical.
- [ ] Add a small in-app fallback surface showing assigned games even when push permission is denied.

## Assignment UI

- [ ] Add a team-admin route for assigning scouters to games.
- [ ] Let team admins choose an event.
- [ ] Let team admins choose a match/team.
- [ ] Let team admins choose a scouter from their team.
- [ ] Save assignments to Firestore.
- [ ] Show existing assignments for the event.
- [ ] Allow team admins to edit assignment scouter.
- [ ] Allow team admins to remove an assignment.
- [ ] Add a scouter "My assigned games" view.
- [ ] Add a "Start scouting" action from an assignment.
- [ ] Pre-fill team number and match number when starting from an assignment.
- [ ] Show assignment status: assigned, queueing/notified, completed.

## Firestore Rules

- [ ] Allow users to write only their own messaging tokens.
- [ ] Allow team admins to create and update assignments only for their team events.
- [ ] Allow team admins to read assignments for their team events.
- [ ] Allow scouters to read their own assignments.
- [ ] Prevent scouters from editing assignment ownership or notification status.
- [ ] Keep Worker notification status writes server-side through the service account.
- [ ] Review existing permissive event/team/pit rules before student testing.

## Cloudflare Worker

- [ ] Create a Worker dedicated to notification handling.
- [ ] Store Firebase project id as a Worker secret or environment variable.
- [ ] Store Firebase service account client email as a Worker secret.
- [ ] Store Firebase service account private key as a Worker secret.
- [ ] Store Nexus webhook token as a Worker secret.
- [ ] Implement Google OAuth JWT access-token flow for REST APIs.
- [ ] Implement Firestore REST helpers for reads, queries, and updates.
- [ ] Implement FCM HTTP v1 send helper.
- [ ] Add `POST /nexus/live-event` webhook endpoint.
- [ ] Verify the `Nexus-Token` header before doing any work.
- [ ] Parse `eventKey`, `dataAsOfTime`, `nowQueuing`, and `matches`.
- [ ] Ignore stale payloads older than the last processed Nexus snapshot.
- [ ] Detect matches with status `Now queuing`.
- [ ] Match Nexus red/blue teams against Firestore assignments.
- [ ] Query only unnotified assignments.
- [ ] Read assigned scouters' active FCM tokens.
- [ ] Send FCM notification to all active tokens for each assigned scouter.
- [ ] Mark assignments with `notifiedAt`, `nexusDataAsOfTime`, and send result.
- [ ] Make notification delivery idempotent so duplicate Nexus payloads do not duplicate pushes.
- [ ] Log event key, match label, assignment count, and send outcomes.

## Firebase Service Account

- [ ] Create a dedicated service account for the Worker.
- [ ] Grant only the minimum roles needed for Firestore document access and FCM send.
- [ ] Do not use project Owner/Admin credentials.
- [ ] Store the private key only in Cloudflare Worker secrets.
- [ ] Document key rotation steps.
- [ ] Confirm the service account can send FCM HTTP v1 messages.
- [ ] Confirm the service account can read and update only the intended Firestore data in practice.

## Nexus Setup

- [ ] Get Nexus API/webhook access.
- [ ] Register the Worker URL as a live event status webhook.
- [ ] Confirm the target event uses Nexus for queueing.
- [ ] Test with a Nexus demo event or sample webhook payload.
- [ ] Include required `frc.nexus` attribution somewhere appropriate in the app or docs.

## Testing

- [ ] Verify app writes FCM tokens after login.
- [ ] Verify notification permission denied still leaves assignments visible in-app.
- [ ] Verify team admin can create an assignment.
- [ ] Verify scouter can see only their own assignments.
- [ ] Manually post a sample Nexus payload to the Worker.
- [ ] Verify one matching assignment receives one notification.
- [ ] Verify duplicate payloads do not send duplicate notifications.
- [ ] Verify stale `dataAsOfTime` payloads are ignored.
- [ ] Verify bad/expired FCM tokens are marked disabled.
- [ ] Verify assignment "Start scouting" opens the correct team and match.
- [ ] Test on a real Android device.
- [ ] Test on a real iPhone if iOS will be used at competition.

## Competition Hardening

- [ ] Add a manual test-notification path or script for admins.
- [ ] Add a manual "refresh assigned games" or obvious fallback path in the scouter UI.
- [ ] Add enough Worker logging to debug event-day issues quickly.
- [ ] Add visible app messaging when notifications are disabled.
- [ ] Document the manual fallback workflow for match assignment and queue reminders.
- [ ] Keep the first release focused on assigned match queue notifications only.

## Implementation Order

- [ ] Build Firestore assignment model and rules.
- [ ] Add app-side FCM token registration.
- [ ] Add team-admin assignment UI.
- [ ] Add scouter assigned-games UI.
- [ ] Build and locally test the Cloudflare Worker.
- [ ] Register Nexus webhook.
- [ ] Run end-to-end device test.
- [ ] Polish fallback states and competition docs.
