# Plan de Nettoyage et Logique à Supprimer (Transition V2)

Ce document liste l'ensemble des mécanismes, variables d'état et composants de la version 1 d'**Incognito** qui doivent être supprimés de la base de code pour implémenter la philosophie "Head-Up Gameplay" de la version 2.

---

## 1. États et Logiques de Base de Données / Session (Firebase & Context)

### A. Suppression de la Validation en Temps Réel (Timer 60s)
*   **Logique** : Le compteur de validation automatique de 60 secondes après l'annonce d'une réussite.
*   **Champs à supprimer de `Agent` / `Session`** :
    *   `pendingValidation` (contenant le challenge, le timestamp de début et le flag `isBluff`).
*   **Méthodes à supprimer de `SessionContext.tsx`** :
    *   `completeChallenge` (la logique de mise en attente de 60s et d'assignation automatique immédiate).
    *   `finalizeChallengePoints` (l'incrémentation automatique de 10 points après 60s sans accusation).

### B. Suppression de l'Action de Bluff
*   **Logique** : Possibilité de simuler une réalisation de défi pour piéger les autres.
*   **Méthodes à supprimer** :
    *   `triggerBluff` (qui ajoutait un événement de suspicion factice).

### C. Suppression des Incidents "Défi Impossible"
*   **Logique** : Voter pour décider si un défi est faisable ou non.
*   **Champs à supprimer de `Agent.incident`** :
    *   Le type d'incident `IMPOSSIBLE`.
*   **Méthodes à supprimer** :
    *   `reportImpossibleChallenge`
    *   `resolveImpossibleChallenge`

### D. Suppression des Incidents d'Accusation en Cours de Partie (Votes & Roulette)
*   **Logique** : La mise en pause automatique du chronomètre général, les phases de réponse à l'accusation dans l'application, les votes collectifs en temps réel, et la Roulette d'arbitrage en cas d'égalité.
*   **Champs à supprimer** :
    *   Les types d'incident `UNMASK_PROMPT` et `UNMASK_VOTE`.
    *   Le champ `rouletteWinnerId` dans l'incident.
    *   La mise en pause du temps via `pausedAt` (le chronomètre global ne s'arrête plus en cours de partie).
*   **Méthodes à supprimer** :
    *   `respondToUnmask` (le suspect ne répond plus sur l'app).
    *   `voteIncident` (plus de vote démocratique en temps réel).
    *   `resolveUnmaskVote` (la résolution n'est plus calculée par l'app pendant la partie).
    *   `triggerRouletteTirage` (la roulette de tirage au sort).

---

## 2. Composants UI à Supprimer ou Simplifier

### A. Composants à Supprimer Complètement
*   **`ActiveIncidentBanner.tsx`** : Plus aucun bandeau d'incident ou de vote ne s'affiche en haut de l'écran en cours de partie.
*   **`ActiveRouletteOverlay.tsx`** : L'animation de roulette de tirage au sort en cas d'égalité est retirée du jeu en cours de partie.
*   **`ActiveModals.tsx`** : Les modales d'abandon, de déclaration d'impossibilité et de confirmation de démasquage en temps réel.

### B. Boutons et Interactions à Retirer de `ActiveChallengeCard.tsx`
*   Le bouton **"Objectif Réussi"** (fingerprint) n'est plus utilisé en temps réel (la validation se fait à la fin au Tribunal).
*   Le bouton **"Bluff"** (icône horloge jaune).
*   Le bouton **"Défi Impossible"** (icône éclair rouge).
*   L'affichage de l'état bloqué / en cours de jugement (lorsqu'un incident était actif).
*   Le badge de validation en attente (`pendingValidation`) avec son décompte textuel de secondes restantes.

---

## 3. Événements et Flux d'Historique

*   Les types d'événements suivants ne sont plus générés en cours de partie :
    *   `SUCCESS` (plus de gain de points automatique).
    *   `UNMASKED` (plus de démasquage automatique résolu).
    *   `FAILED_UNMASK` (plus de fausse accusation résolue immédiatement).
    *   `BLUFF_SUCCESS`
*   Le flux d'événements (`ActiveEventFeed`) n'affiche plus que les logs système très simplifiés (départs de joueurs, alertes QG) ou sera remplacé par le nouvel historique de buzzes IRL.
