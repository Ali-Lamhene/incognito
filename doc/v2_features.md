# Feuille de Route : Principaux Changements à Opérer (Version 2)

D'après le document de conception `restructure.md`, voici la liste des nouvelles mécaniques et évolutions à implémenter pour transformer **Incognito** en compagnon discret de table (concept de "Head-Up Gameplay").

---

## 1. Mécaniques en Cours de Partie (ACTIVE)

### A. L'Inventaire de Défis (La "Main")
*   **Changement** : Remplacement du défi unique par une "main" de **3 défis simultanés**.
*   **UI/UX** : Liste de défis sur la carte personnelle, gérable en autonomie par le joueur.

### B. Le Système d'Accusation (Le Bouton Rouge "BUZZ")
*   **Changement** : Ajout d'un gros bouton rouge **BUZZ** sur l'écran principal de l'agent.
*   **Effet audio** : Déclenchement d'un signal sonore global (sirène ou buzzer bruyant) sur tous les téléphones de la table.
*   **Mécanique IRL** : L'accusation se fait à l'oral ("Je t'accuse de..."). L'accusateur enregistre ensuite le couple [Accusateur $\rightarrow$ Cible] via un bouton rapide.
*   **Absence de Malus** : Les fausses accusations ne retirent plus de points en cours de partie.

### C. Les "Intel Drops" (Fuites du QG)
*   **Changement** : Alertes sonores globales périodiques initiées par le serveur.
*   **Interaction** : Le premier joueur qui lit son écran doit annoncer l'information de renseignement à voix haute (ex : *"Présence d'un Profileur confirmée à table"*).

---

## 2. Rôles Secrets et Pouvoirs (Asymétrie)

### A. Règle du N+1
*   **Changement** : Lors de la distribution, le jeu tire $N+1$ rôles (où $N$ est le nombre de joueurs) et défausse le rôle restant secrètement.

### B. Implémentation des 4 Rôles
1.  **L'Agent Standard** : Aucun pouvoir (couverture classique).
2.  **Le Profileur** : Affiche sur son terminal le texte exact d'un véritable défi présent à la table (sans savoir à qui il appartient).
3.  **L'Agent Double** : Reçoit une "main leurre" (faux défis). Son but est de se faire accuser (buzzer) spécifiquement pour ces faux défis pour gagner des points.
4.  **L'Agent de Propagande** : Reçoit un faux défi (qui n'appartient à personne) et doit manipuler la conversation pour pousser un tiers à accuser faussement un autre joueur de ce défi.

---

## 3. Phase Finale : Le Tribunal (REVEAL)

### A. Changement d'État
*   **Changement** : Remplacement des résultats passifs par un écran interactif de "Tribunal".

### B. Déroulement du Tribunal
1.  **Révélation des Identités** : Dévoilement des rôles secrets de chacun.
2.  **Défense Orale** : Chaque joueur, tour à tour, explique oralement comment et quand il a accompli chaque défi de sa main.
3.  **Validation Manuelle** : L'Hôte (ou le groupe via des boutons) valide ou invalide les points défi par défi.
4.  **Audit de l'Historique des Buzz** : Confrontation entre l'historique des accusations (buzz enregistrés) et la défense pour débusquer les menteurs (application du "Malus du Menteur" si un joueur a nié un défi réussi pour lequel il a été buzzé à juste titre).
