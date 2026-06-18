# Scouter App Missing Checklist

This checklist captures the current known gaps in the Scouter app after a light product/code audit.

## Must Fix

- [x] Fix lint/TypeScript validation setup. `expo lint` fails because `.eslintrc.cjs` points to root `./tsconfig.json`, but this repo only has app/package tsconfigs.
- [x] Guard admin team pages against unloaded or empty teams. `apps/scouter/app/(app)/admin/[eventId]/team/[id].tsx` can reduce an empty `team.games` array and dereference a missing `bestGame`.
- [x] Add loading/not-found states for analytics pages. `apps/scouter/app/(app)/admin/[eventId]/analytics/[id].tsx` assumes `team` exists before reading `team.games`.
- [x] Fix team/event store permission and loading behavior. `apps/scouter/lib/stores/eventStore.ts` returns early for non-app-admin users without clearing loading or showing permission feedback.
- [x] Validate missing event/game data before rendering. Several screens assume `events[eventId]` and `games[event.year]` exist.

## Data Integrity

- [x] Clear stale subscription state before repopulating collections in `EventStore` and `RegistrationCodesStore`.
- [ ] Decide whether registration codes are one-time-use, revocable, or reusable forever.
- [x] Improve offline queue metadata and retry behavior. Failed retries can lose whether an item was game or pit data.
- [x] Add duplicate protection for match submissions so the same team/game does not overwrite silently.
- [x] Add stricter validation for team number, match number, and pit team selection before navigating into forms.

## Product Gaps

- [ ] Add empty/error states for scouter event list, event detail, pit form unavailable, and no teams/no games.
- [ ] Add confirmation before leaving an in-progress scouting form.
- [ ] Add "saved offline / pending uploads" UI so scouters know data is queued.
- [ ] Add admin controls for deleting/editing events, teams, games, pit data, and registration codes.
- [ ] Add user management: view registered users, roles, team admins, and revoke access.
- [ ] Add onboarding/help copy for demo mode vs real submission.

## UI And Forms

- [ ] Implement select fields in shared forms. `packages/ui/components/form/FormInline.tsx` currently renders select as a disabled input with a TODO.
- [ ] Normalize loading indicators. Some screens return `null` or empty containers instead of a clear loading/error surface.
- [ ] Check mobile layout of admin stat rows; several pages put multiple stat cards in one row.
- [x] Remove unused variables/imports once lint works, for example registration code keyboard height state.

## Nice Next

- [ ] Add tests for scoring calculations and form initialization per game year.
- [ ] Add tests for offline queue save/resend, especially retry failures.
- [ ] Add a local seed/demo dataset for reliable demo mode.
- [ ] Document required `.env.local` keys for Firebase and The Blue Alliance.
- [ ] Add a CI command that verifies scouter app lint/typecheck from the monorepo root.

## Audit Notes

- Checked scouter routes, stores, forms, Firebase/TBA hooks, and shared UI form code.
- Ran `bun run lint` from `apps/scouter`; it failed at ESLint parser setup before code-level linting.
