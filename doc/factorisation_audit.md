# État des lieux de la factorisation du code : Incognito

Ce document présente l'audit d'organisation et de factorisation du code du projet **Incognito**, en identifiant les points forts actuels et les pistes de modularisation futures.

---

## 1. Analyse de l'existant (Points Forts)

La structure actuelle respecte de très bonnes pratiques d'ingénierie logicielle pour React Native / Expo :
*   **Séparation des responsabilités (MVC/MVVM)** : Tous les écrans majeurs (`app/index.tsx`, `app/lobby/[code].tsx`, `app/mission/active.tsx`, etc.) délèguent entièrement leur logique métier et leurs appels Firebase à des hooks personnalisés (`useLobby`, `useActiveMission`, `useCreateMission`, `useJoinMission`).
*   **Composants spécialisés** : Le code de présentation est découpé en composants autonomes et réutilisables (ex: `LobbyAgentsList`, `JoinCodeInput`, `ActiveEventFeed`, `DurationSelector`).
*   **Gestion du Style** : La feuille de style de chaque composant complexe est externalisée dans un fichier `.styles.ts` associé (ex: `ActiveIncidentBanner.styles.ts`), évitant ainsi d'encombrer les fichiers TSX principaux.

---

## 2. Opportunités de Factorisation & Pistes d'Amélioration

Bien que l'architecture soit propre, certaines optimisations de factorisation peuvent être entreprises pour pérenniser l'évolutivité de l'application :

### A. Découpage de `ActiveIncidentBanner.tsx` (Priorité Haute)
Le composant `ActiveIncidentBanner` (455 lignes) gère trois types d'incidents complexes et très distincts :
1.  **`IMPOSSIBLE`** (déclaration de défi irréalisable par un joueur).
2.  **`UNMASK_PROMPT`** (demande de confession après accusation).
3.  **`UNMASK_VOTE`** (vote démocratique en cas de négation).

*Piste de factorisation* : Créer un dossier `components/incidents/` et découper ces trois cas en sous-composants dédiés :
*   `ImpossibleIncidentView.tsx`
*   `UnmaskPromptView.tsx`
*   `UnmaskVoteView.tsx`
Cela réduirait la taille de la bannière principale à moins de 100 lignes de pure distribution d'état.

### B. Mutualisation des overlays de fond (Priorité Moyenne)
Les composants `AgentHomeBackground`, `LobbyBackground`, et `BackgroundAtmosphere` ont tous des logiques similaires pour appliquer les overlays de texture (`tactical_texture.jpg`) et les grilles tactiques (`hudGrid` / `gridOverlay`).
*Piste de factorisation* : Extraire les éléments communs (comme les lignes de grille dynamiques ou l'overlay de texture tactique) dans un sous-composant `TacticalGridOverlay.tsx` réutilisable.

### C. Simplification de `ActiveChallengeCard.tsx` (Priorité Basse)
Avec 315 lignes, ce composant gère les états masqués, déverrouillés, le chronomètre terminal et le badge de vérification en attente. 
*Piste de factorisation* : Le sous-composant de badge de statut en attente (`pendingValidation`) et le header de terminal pourraient être extraits dans des fichiers indépendants (`TerminalHeader.tsx` et `ValidationCountdownBadge.tsx`).
