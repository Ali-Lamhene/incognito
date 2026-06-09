# Game Mechanics Summary: Incognito

This document describes the core game mechanics, session flows, and scoring logic of **Incognito** to enable any AI model or developer to understand the application.

---

## 1. Core Concept
**Incognito** is a real-time mobile social deduction game played in the background of real-life social settings (e.g., parties, dinners, team-building).
- Players (**Agents**) are assigned secret challenges (gestures, phrases, behaviors) to perform in front of other players without getting caught.
- The game relies on a real-time database (Firebase Realtime Database) for synchronized actions, events feed, and state management.

---

## 2. Session Lifecycle & States
A session (`MissionSession`) goes through three statuses:
1. **`LOBBY`**:
   - Host creates a session with a unique 4-character code (e.g., `A7B2`) and sets the duration (in minutes).
   - Agents join using the code and a nickname.
   - When the Host starts the game, every agent is assigned a secret challenge from a shuffled pool (`CHALLENGES`).
2. **`ACTIVE`**:
   - The game timer counts down in real time.
   - Normal gameplay and incident phases occur.
3. **`FINISHED`**:
   - The game ends (via host action or timer expiration).
   - The leaderboard displays the final standings.

---

## 3. Secret Challenges
Challenges (`CHALLENGES`) are short, awkward, or funny actions grouped into three stylistic categories:
- **`SOCIAL`**: Slight behavioral anomalies (e.g., *S2: "Se toucher l'oreille gauche 3 fois dès que vous prenez la parole"*).
- **`ABSURD`**: Strange gestures or tech-related nonsense (e.g., *A26: "Demander si cette table est compatible avec le format Bluetooth"*).
- **`RISKY`**: Spy-themed or highly suspicious phrases/actions (e.g., *R1: "Chuchoter à votre voisin : 'Ils nous observent, fais semblant de rien'"*).

---

## 4. Active Gameplay Mechanics

### A. Challenge Completion Flow
1. **Initiation**: An agent accomplishes their secret challenge in real life.
2. **Action**: They tap **"J'ai réussi mon défi" (Complete Challenge)** on the app.
3. **Suspect Window**: 
   - The agent enters a `pendingValidation` state for **60 seconds**.
   - A public `SUSPECT` event is pushed to the global event feed (e.g., *"Agent X looks suspicious..."*).
4. **Validation**:
   - If the 60 seconds expire without the agent being unmasked, they get **+10 points** and automatically receive a new challenge.

### B. Bluffing
- Agents can tap **"Bluff"** to manually trigger a fake `SUSPECT` event in the feed without actual challenge completion.
- Used to trick opponents into making a false accusation, which carries a point penalty.

### C. Unmasking ("Démasquer")
- If an agent suspects someone of performing a challenge, they click **"Démasquer" (Unmask)** on that target.
- This **pauses the global game timer** and triggers an **Unmask Incident**.

---

## 5. Incident & Voting Resolutions
When an incident is active, normal gameplay is paused, and the involved players must resolve it.

### A. Unmask Incident (`UNMASK_PROMPT` -> `UNMASK_VOTE`)
1. **Confession Prompt (`UNMASK_PROMPT`)**: The accused is asked: *"Did they catch you?"*
   - **Confess (Yes)**: The accused confesses. 
     - *Scoring*: Accuser gets **+10 pts**, Accused gets **-10 pts** (or malus).
     - Accused receives a new challenge. The game timer resumes.
   - **Deny (No)**: The accused claims innocence. The incident escalates to a group vote.
2. **Group Vote (`UNMASK_VOTE`)**: All other active players (excluding accuser and accused) vote on whether the accusation was correct:
   - **"He is right" (YES)** vs. **"He is wrong" (NO)**.
   - **Resolution by Majority**:
     - **YES Wins**: Accusation is correct. Accuser gets **+10 pts**, Accused gets **-10 pts**. Accused gets a new challenge.
     - **NO Wins**: Falsely accused. Accused gets **+10 pts** (survival bonus), Accuser gets **-10 pts** (false accusation penalty).
   - **Resolution by Roulette (Tie-Breaker / No Voters)**:
     - If there is a tie or not enough voters (e.g., small player count), a **Roulette wheel** animation plays.
     - The system performs a coin-flip (50/50 chance) between the accuser and the accused. The winning player receives the +10 pts, and the loser receives the -10 pts.
   - *Post-Resolution*: The timer resumes, and the incident is cleared.

### B. Impossible Challenge Incident (`IMPOSSIBLE`)
- If an agent receives a challenge that cannot be done (e.g., social/physical constraint), they can report it as **Impossible**.
- The timer pauses, and other agents vote on whether the challenge is **Impossible** or **Feasible**.
- **Resolution by Majority**:
   - **Impossible Wins**: The challenge is swapped. No points penalty.
   - **Feasible Wins**: The challenge is swapped, but the agent receives a **-10 pts** penalty.
- The timer resumes.

---

## 6. Point Matrix Summary

| Action / Outcome | Accuser/Reporter Points | Accused/Target Points |
| :--- | :--- | :--- |
| **Successful Challenge (60s timer expires)** | N/A | **+10** |
| **Correct Unmasking (Confession or YES vote)** | **+10** | **-10** |
| **False Accusation (NO vote)** | **-10** | **+10** |
| **Roulette Arbitration Win** | **+10** (if accuser wins) | **+10** (if accused wins) |
| **Roulette Arbitration Loss** | **-10** (if accuser loses) | **-10** (if accused loses) |
| **Impossible Challenge Vote (Impossible wins)** | N/A | **0** (Challenge swapped) |
| **Impossible Challenge Vote (Feasible wins)** | N/A | **-10** (Challenge swapped) |
