# Scouter Queue Notifications Checklist

This checklist tracks the plan for notifying assigned scouters when their assigned team is queueing. The intended architecture is Firebase-first: Firestore remains the source of truth, Firebase Cloud Messaging sends notifications, and Cloudflare Workers are used only as a small Nexus webhook handler.

## Architecture

- [ ] Keep assignments, users, tokens, events, and future robot images in Firebase.
- [ ] Use Cloudflare Workers only for receiving Nexus webhook calls and dispatching notification work.
- [ ] Use Firestore as the only app database.
- [ ] Use Firebase Cloud Messaging for native device notifications.
- [ ] Use Expo push tokens for iOS Expo Go testing, with the Worker routing those through Expo's push endpoint.
- [ ] Avoid Firebase Cloud Functions for this feature.
- [ ] Confirm whether the official event key in Nexus matches the app's existing Firestore `events/{eventId}` document id.

## Firestore Data Model

- [x] Add `events/{eventId}/assignments/{assignmentId}`.
- [x] Store assignment fields: `teamNumber`, `matchNumber`, `scouterId`, `scouterName`, `createdBy`, `createdAt`, `updatedAt`, `notifiedAt`.
- [x] Store Nexus delivery fields: `lastNexusStatus`, `nexusDataAsOfTime`, `notificationResult`, `notificationError`.
- [x] Add `users/{uid}/messagingTokens/{tokenId}`.
- [x] Store token fields: `token`, `tokenType`, `provider`, `platform`, `appVersion`, `createdAt`, `updatedAt`, `disabledAt`.
- [x] Decide whether assignments are keyed by generated ids, match labels, or `{match}-{team}-{scouter}` deterministic ids.
- [ ] Add enough fields to query unnotified assignments by event and team without expensive client-side filtering.

## App Notification Setup

- [x] Add notification client dependency and configuration.
- [ ] Configure Android Firebase file: `google-services.json`.
- [ ] Configure iOS Firebase/APNs setup if students will use iPhones.
- [x] Request notification permission after sign-in or onboarding.
- [x] Fetch an Expo push token in Expo Go for iOS testing.
- [ ] Fetch a native device push token outside Expo Go when the native app supports push entitlements, if we decide to bypass Expo Push later.
- [x] Write the token to `users/{uid}/messagingTokens/{tokenId}`.
- [x] Refresh/update the token when it changes.
- [ ] Disable or delete the current device token on sign-out when practical.
- [x] Add a small in-app fallback surface showing assigned games even when push permission is denied.

## Assignment UI

- [x] Add a team-admin route for assigning scouters to games.
- [ ] Let team admins choose an event.
- [x] Let team admins choose a match/team.
- [x] Let team admins choose a scouter from their team.
- [x] Save assignments to Firestore.
- [x] Show existing assignments for the event.
- [ ] Allow team admins to edit assignment scouter.
- [x] Allow team admins to remove an assignment.
- [x] Add a scouter "My assigned games" view.
- [x] Add a "Start scouting" action from an assignment.
- [x] Pre-fill team number and match number when starting from an assignment.
- [ ] Show assignment status: assigned, queueing/notified, completed.

## Firestore Rules

- [x] Allow users to write only their own messaging tokens.
- [x] Allow team admins to create and update assignments only for their team events.
- [x] Allow team admins to read assignments for their team events.
- [x] Allow scouters to read their own assignments.
- [x] Prevent scouters from editing assignment ownership or notification status.
- [x] Keep Worker notification status writes server-side through the service account.
- [ ] Review existing permissive event/team/pit rules before student testing.

## Cloudflare Worker

- [ ] Create a Worker dedicated to notification handling.
- [ ] Store Firebase project id as a Worker secret or environment variable.
- [ ] Store Firebase service account client email as a Worker secret.
- [ ] Store Firebase service account private key as a Worker secret.
- [ ] Store Nexus webhook token as a Worker secret.
- [ ] Implement Google OAuth JWT access-token flow for REST APIs.
- [ ] Implement Firestore REST helpers for reads, queries, and updates.
- [ ] Implement FCM HTTP v1 send helper for native tokens.
- [ ] Implement Expo Push API send helper for Expo Go test tokens.
- [ ] Route notification sends by stored token `provider`.
- [ ] Add `POST /nexus/live-event` webhook endpoint.
- [ ] Verify the `Nexus-Token` header before doing any work.
- [ ] Parse `eventKey`, `dataAsOfTime`, `nowQueuing`, and `matches`.
- [ ] Ignore stale payloads older than the last processed Nexus snapshot.
- [ ] Detect matches with status `Now queuing`.
- [ ] Match Nexus red/blue teams against Firestore assignments.
- [ ] Query only unnotified assignments.
- [ ] Read assigned scouters' active push tokens.
- [ ] Send notifications to all active tokens for each assigned scouter.
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

- [ ] Verify app writes push tokens after login.
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

- [x] Build Firestore assignment model and rules.
- [x] Add app-side push token registration.
- [x] Add team-admin assignment UI.
- [x] Add scouter assigned-games UI.
- [ ] Build and locally test the Cloudflare Worker.
- [ ] Register Nexus webhook.
- [ ] Run end-to-end device test.
- [ ] Polish fallback states and competition docs.

## Nice Next

- [ ] Fetch match team lists from The Blue Alliance and limit the assignment team dropdown to only the teams playing in the selected match.
- [ ] Outside this checklist: let scouters pick from assigned games without reselecting team and match number.
