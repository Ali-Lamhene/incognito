# Spécifications de l'Interface Utilisateur (UI) : Incognito

Ce document décrit avec précision la charte graphique, les composants visuels réutilisables, ainsi que la mise en page de chaque écran de l'application mobile **Incognito**.

---

## 1. Direction Artistique & Charte Graphique

L'esthétique globale est inspirée de l'**espionnage technologique (cyber-espionage)**, du style **télécom militaire** et des interfaces de **dossiers classifiés**. L'affichage simule un terminal crypté ou une console de surveillance de terrain.

### A. Palette de Couleurs
*   **Fond Principal** : Noir absolu (`#000000`) pour une immersion totale et une économie de batterie (optimisé pour les écrans OLED).
*   **Surcouches de Fond** : Blanc opacité ultra-faible (`rgba(255, 255, 255, 0.03)` à `0.05`) pour simuler des panneaux de verre dépoli.
*   **Texte et Éléments Primaires** : Blanc pur (`#FFFFFF`) et Gris clair (`#CCCCCC`).
*   **Couleur d'Alerte / Incidents** : Rouge Corail / Néon (`#FF6B6B`) pour attirer immédiatement l'attention.
*   **Couleur de Succès** : Vert Émeraude (`#4CAF50`) pour les objectifs validés.
*   **Couleur de Vigilance / Bluff** : Jaune Cyber (`#FFD93D`) pour le statut de validation.
*   **Couleur d'Accusation** : Violet Pastel (`#A29BFE`) pour l'unmasking.

### B. Typographie & Effets Visuels
*   **Typographie** : Utilisation intensive de polices à chasse fixe (Monospace) et de styles "sans empattement" modernes de type militaire.
*   **Bords et Angles (Tactical Corners)** : Les cadres interactifs ne possèdent pas de simples bordures rondes classiques, mais de petits crochets d'angle (`cornerTL`, `cornerTR`, etc.) imitant un affichage tête haute (HUD).
*   **Flou d'Arrière-Plan** : Utilisation d'`expo-blur` (`BlurView`) avec une intensité légère (30) pour donner un aspect "verre fumé transparent".
*   **Lignes de Balayage (Scanlines)** : Une ligne horizontale lumineuse animée (`Reanimated`) traverse continuellement les cadres pour simuler un scan radar ou biométrique en temps réel.

---

## 2. Écran d'Accueil (`Home`)

*   **Arrière-plan** : Bureau d'agent secret flouté avec un filtre de lignes radar en mouvement.
*   **Header Tactique (`AgentHeader`)** :
    *   À gauche : Avatar de l'agent et son nom de code dans un encadré gris.
    *   À droite : Icône d'engrenage (paramètres) et icône de bouclier/dossier (règles du jeu).
*   **Dossier Central (`DossierFrame`)** :
    *   Un grand cadre à angles tactiques entouré de lignes de numérisation animées de haut en bas.
    *   Logo de l'application suivi du nom "INCOGNITO" épelé par des lettres individuelles pivotées, disposées sur des blocs alternant fond noir et texte blanc (style "lettre anonyme").
    *   Métadonnées affichées dans les coins en police miniature de couleur grise : coordonnées GPS (`LOC_48.8566_2.3522`), niveau de menace (`THREAT_LEVEL: STABLE`), et code d'identification.
*   **Section Actions (Bas d'écran)** :
    *   Badge d'état : `"DEPLOIMENT PROTOCOL"`.
    *   Bouton Principal : Blanc opaque à texte noir `"CRÉER UNE MISSION"`.
    *   Bouton Secondaire : Contour fin blanc `"REJOINDRE UNE MISSION"`.
    *   *Overlay* : flux continu de données codées défilant discrètement sur les bords de l'écran (`SideDataStream`).

---

## 3. Écran du Salon (`Lobby`)

*   **En-tête** : Affiche le code unique de session (ex: `A7B2`) en très grands caractères monospaces espacés, avec un bouton "Copier" ou un QR Code stylisé (`LobbyQRFrame`) pour inviter d'autres joueurs en local.
*   **Roster des Joueurs (`LobbyAgentsList`)** :
    *   Liste verticale des "agents connectés".
    *   Chaque agent apparaît sous forme de ligne avec son avatar circulaire, son pseudo et une puce lumineuse indiquant son statut (`READY` en vert, `WAITING` en gris).
*   **Panneau de Configuration (Hôte uniquement)** :
    *   Sliders ou sélecteurs tactiles (`DurationSelector`) pour définir le temps de mission.
    *   Thématiques des défis représentées sous forme de badges sélectionnables.
*   **Bouton d'Envoi** : Grand bouton rouge clignotant ou blanc marqué `"LANCER LA PARTIE"`.

---

## 4. Écran de Mission Actif (`ActiveMissionScreen`)

L'interface de jeu est conçue pour être consultée d'un seul coup d'œil rapide avant de verrouiller son téléphone.

### A. En-tête de Mission (`ActiveHeader`)
*   Affiche le nom de code de l'agent, le code de session et son niveau de "crédits" (points) avec une icône de puce électronique ou de coffre.

### B. Carte de Défi Centrale (`ActiveChallengeCard`)
*   **Header du Terminal** : Une ligne avec un point clignotant et l'affichage d'un chronomètre sous forme de badge rétro-éclairé (devient rouge vif si le temps est inférieur à 60 secondes).
*   **Corps de la Carte** : Un grand cadre sombre utilisant du flou d'arrière-plan.
*   **Zone d'Affichage Masquée** :
    *   Par défaut : Icône de cadenas géante avec le texte `"DÉCRYPTAGE REQUIS - Appuyer pour scanner"`.
    *   Action de scan : Lorsque le joueur appuie, une ligne laser blanche balaye la carte de haut en bas, puis affiche le texte du défi (ex : *"Se gratter le menton avec le coude"*).
    *   Pour des raisons de sécurité, le texte s'efface immédiatement si le joueur appuie à nouveau.
*   **Boutons Tactiques d'Action** :
    *   **Bouton Réussite** (Grand format) : Contour vert émeraude, icône d'empreinte digitale, texte `"OBJECTIF RÉUSSI"`.
    *   **Boutons Secondaires** (Côte à côte) :
        *   `Bluff` : Jaune cyber avec icône d'horloge.
        *   `Défi Impossible` : Rouge transparent avec icône d'éclair.

### C. Roster des Cibles (`ActiveAgentsList`)
*   Liste compacte affichant les autres joueurs. À côté de chaque nom se trouve un bouton avec une icône de viseur ou d'empreinte digitale marquée `"DÉMASQUER"`.

### D. Bannière d'Incidents Tactiques (`ActiveIncidentBanner`)
*   Se déploie en haut de l'écran lors d'une accusation ou d'une réclamation d'impossibilité.
*   Elle prend une teinte rouge corail pour l'accusé ou violette pour les votes de groupe.
*   Affiche en temps réel le décompte des votes sous forme de barres horizontales colorées (`YES` / `NO`).

### E. Roulette d'Arbitrage (`ActiveRouletteOverlay`)
*   En cas d'égalité lors des votes, un overlay plein écran noir se superpose.
*   Affiche une animation circulaire rapide sélectionnant alternativement le portrait de l'accusateur et de l'accueilli avant de s'arrêter sur le vainqueur sous un stinger sonore de tension.

### F. Flux d'Événements (`ActiveEventFeed`)
*   Un flux de notifications translucide défile en bas de l'écran, listant les actions sous forme de logs de terminal (ex: `[14:52:10] AGENT D. suspecté...`, `[14:52:45] MISSION RÉUSSIE par AGENT K. (+10pts)`).

---

## 5. Écran de Résultats (`Results`)

*   **Podium d'Honneur** : Présentation tridimensionnelle épurée avec les trois meilleurs agents (Or, Argent, Bronze).
*   **Tableau Récapitulatif** :
    *   Lignes horizontales affichant les statistiques complètes de chaque joueur : score total, nombre de défis réussis, nombre de bluffs réussis et taux de fausses accusations commises.
    *   Bouton `"RETOUR AU SALON"` en bas de l'écran pour relancer une partie.
