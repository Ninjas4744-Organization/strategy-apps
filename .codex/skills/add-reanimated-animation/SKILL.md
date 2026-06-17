---
name: add-reanimated-animation
description: Add or port a React Native Reanimated animation into this project from the Make It Animated source repo submodule at utils/makeitanimated. Use when the user asks to add an animation, copy an animation by slug or makeitanimated.dev URL, adapt a Reanimated demo, or bring over animation source/assets/dependencies from that repo into the strategy apps.
---

# Add Reanimated Animation

## Source Repo

Canonical animation library:

`utils/makeitanimated`

The source repo is an Expo Router app with animation demos under `src/apps/**`, route files under `app/(apps)/**`, shared helpers under `src/shared/**`, and assets under `assets/**`.

If the submodule is missing or empty in a fresh checkout, initialize it first:

```sh
git submodule update --init --recursive utils/makeitanimated
```

## Workflow

1. Identify the requested animation.
   - Accept a slug, makeitanimated.dev URL, animation name, or app/screen hint.
   - If given a URL, use the final path segment as the slug.
   - If the slug is unknown, search the source repo:

```sh
rg "<slug-or-keywords>" utils/makeitanimated/src utils/makeitanimated/app
```

2. Find all source files for that animation.
   - Prefer exact slug matches first:

```sh
rg "<animation-slug>" utils/makeitanimated
```

   - Read `utils/makeitanimated/src/shared/lib/constants/animations.ts` to map `slug` to `href`.
   - Use the `href` to find the source route in `app/(apps)/**` and the implementation in `src/apps/**`.
   - Follow imports from the route/component until all animation-specific components, hooks, constants, data, assets, and type files are accounted for.
   - Do not copy unrelated app shell, registry, Algolia/store code, or website-only metadata unless required by the animation.

3. Inspect this project before editing.
   - Target app is usually `apps/scouter`; use `apps/trainee` only when the user explicitly names it or the surrounding task clearly points there.
   - Read existing nearby route/component patterns, alias config, styled-components usage, Metro asset handling, and package dependencies before deciding where files belong.
   - Preserve this repo's architecture; adapt the animation into a local feature/screen instead of recreating the source repo structure wholesale.
   - Treat the source repo as an animation reference, not a styling or library-convention reference. Do not introduce NativeWind, Tailwind, `className` styling helpers, or new styling libraries just because the source uses them.

4. Port deliberately.
   - Copy only the minimal files needed, then adapt imports and paths.
   - Convert source styles to this project's `styled-components` patterns where the target app already uses them. If the target area uses plain React Native styles, match nearby code.
   - Move source assets into an appropriate `apps/scouter/assets/**` or `apps/trainee/assets/**` location when needed, and keep `require(...)` / import paths valid for Expo Metro.
   - If the source uses shared helpers from `rn-makeitanimated`, either reuse an equivalent helper already present here or port the smallest helper needed.
   - If a source dependency is missing from the target app's `package.json`, add it only when the animation genuinely needs it and the dependency is compatible with Expo SDK 56 / React Native 0.85.
   - Prefer Reanimated v4 APIs already used by this repo. In React Compiler-compatible code, prefer `shared.get()` and `shared.set()` over `shared.value` when practical.
   - Avoid `runOnJS` and `runOnUI`; use Worklets APIs such as `scheduleOnRN` / `scheduleOnUI` when that bridge is needed.

5. Integrate the animation into the requested app surface.
   - If the user named a target route/component, wire it there.
   - If no target was named, create the smallest discoverable dev/demo route or component consistent with the chosen app's patterns, then tell the user where it lives.
   - Keep UI text minimal; the animation itself should be the first thing a tester can see and interact with.

6. Verify.
   - Run focused checks such as:

```sh
bunx tsc -p apps/scouter/tsconfig.json --noEmit
bun --cwd apps/scouter run lint
```

   - For trainee changes, use the matching `apps/trainee/tsconfig.json` and available package scripts.
   - If a local Expo server is already running, reload it after changes. If visual behavior matters and a browser/simulator target is available, open it and check that the animation renders and responds.

## Source Repo Conventions Worth Preserving When Useful

- Component files are kebab-case.
- Components are arrow function expressions.
- Preserve animation structure, timing, gestures, assets, and Reanimated logic when they fit the target app.
- Use this repo's existing styling conventions for layout and presentation, even when the source uses NativeWind/Tailwind or `StyleSheet.create`.
- Keep module order tidy: imports, constants, types, component, styles.

## When Reporting Back

Mention the source slug/name used, the target files changed, any dependencies/assets added, and the verification run. If an exact port was not possible, call out what was adapted and why.
