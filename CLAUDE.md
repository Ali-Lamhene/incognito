# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Incognito is a real-time social-deduction party game (React Native + Expo SDK 54, Expo Router, TypeScript strict, New Architecture, React Compiler enabled). Players join a shared game ("mission") by code or QR, each gets secret challenges to perform in real life, and others try to "unmask" them. Design docs (French) live in `doc/` — `doc/current_gameplay.md` describes the gameplay actually implemented; other docs (`v2_features.md`, `gameplay_roadmap.md`, etc.) are plans/audits, not current behavior.

## Commands

```bash
npm install
npx expo start          # dev server (npm start); npm run android / ios / web
npm run lint            # expo lint (eslint-config-expo)
npx tsc --noEmit        # type check
eas build --profile development|preview|production   # see eas.json
```

There is no test suite.

## Architecture

- **Routing** (`app/`, Expo Router, typed routes): `(tabs)/` = home, rules, settings. Game flow: `mission/create` or `mission/join` / `mission/scan` (QR via expo-camera) → `lobby/[code]` → `mission/active` → `mission/results`. Root `app/_layout.tsx` loads fonts, forces dark UI, and wraps everything in `SessionProvider`.
- **Game state = `context/SessionContext.tsx`** (central file). All multiplayer state lives in Firebase Realtime Database under `missions/{code}` (`status: LOBBY|ACTIVE|FINISHED`, `agents/{agentId}`, `events/{eventId}`, `startedAt`, `duration`, `terrain`). The provider subscribes with `onValue` and exposes actions (`createSession`, `joinSession`, `startMission`, `unmaskAgent`, `confessAccusation`, `denyAccusation`, `pushEvent`, `clearSession`…). Multi-path writes use `update(ref(db), { 'missions/...': ... })`. The local session (code + role `HOST`/`AGENT`) is persisted in AsyncStorage key `incognito_session` so a player can rejoin after closing the app. There is no backend server; the host's client does the challenge assignment in `startMission`.
- **Presence and host**: `SessionProvider` (re)registers the current agent on every `.info/connected` with `update` (never `set`, which would wipe challenges); a disconnect only sets `online: false`. `missions/{code}/hostId` is the source of truth for the host: the local `role` follows it. `clearSession` → `leaveMission` hands `hostId` to the earliest `joinedAt` agent (online first) and deletes the mission only when the last agent leaves. Always cancel `onDisconnect` before removing an agent node.
- **Scoring** (tribunal, `handleValidateScores` in `app/mission/results.tsx`): +10 challenge succeeded, -10 unmasked, -30 lied; the accuser gets +5 per challenge confessed in game (`unmaskedBy`), nothing for a box ticked by hand at the tribunal, no penalty for a wrong accusation. Keep the Rules screen (`rules.*` locale keys) in sync.
- **Screen logic hooks** (`hooks/useCreateMission`, `useJoinMission`, `useLobby`, `useActiveMission`) sit between screens and the context; screens are mostly presentation using `components/`.
- **Local persistent stores** (`store/`, zustand + `persist` on AsyncStorage): `profileStore` (agent id, codename, avatar, color, stats) and `settingsStore` (haptics, language `fr|en`, default `fr`).
- **Challenges**: `constants/Challenges.ts` (`CHALLENGES`) is the source used by the game. Each entry has a `terrain` (1 BASE SECRÈTE, 2 TERRAIN LIBRE, 3 INFILTRATION); the same challenge is duplicated per terrain with id suffix `_1/_2/_3`. English texts live in `CHALLENGE_TEXT_EN` keyed by the base id (no suffix); display challenges with `getChallengeText(challenge, language)`, never `challenge.text` (that is the host's language). `constants/misions.ts` is not imported anywhere.
- **i18n**: custom `hooks/useTranslation.ts` — `t('a.b.c')` looks up `locales/fr.json` / `locales/en.json`, returns the key if missing. Add new keys to both files. `locales/ios/*.json` are only iOS `InfoPlist` strings (camera permission) wired via `app.json` `locales`; keep them iOS-only (Android lint `ExtraTranslation` broke when they were not scoped).
- **Firebase config** (`services/firebase.ts`) reads `EXPO_PUBLIC_FIREBASE_*` env vars: `.env` holds placeholders (committed), real keys go in `.env.local` (gitignored).

## Gotchas

- `metro.config.js` forces `zustand` and `zustand/middleware` to their CJS builds, and `babel.config.js` applies `babel-plugin-transform-import-meta` (including `node_modules`) — both work around an `import.meta` error. Don't remove them.
- Bundle ids differ per platform: iOS `com.alilamhene.incognito`, Android `com.otakumi.incognito`. EAS uses remote app version source with `autoIncrement` on production; the user-facing version is `app.json` `expo.version`.
- `.easignore` excludes `doc/`, `branding.html`, and store visuals from EAS builds; `app-example/` is the leftover Expo template (gitignored).
- Camera permission text in `app.json` was written to satisfy App Store guideline 5.1.1 — keep it specific about QR-code-only use.
