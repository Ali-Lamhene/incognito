# Spécifications de Jeu & Feuille de Route (Roadmap)

Ce document sert de spécification de référence pour le développement des prochaines fonctionnalités de gameplay de l'application **Incognito**.

---

## 2. Logique d'Accusation Simplifiée

En cours de partie, lorsqu'un joueur tente d'en démasquer un autre :
- L'accusé reçoit une notification/modal sur son écran : *"L'Agent X vous accuse d'avoir réalisé un défi"*.
- **Option 1 : AVOUER** 
  - L'accusé reconnaît les faits. 
  - On enregistre cette confession dans la base de données (`unmaskedStatus = 'CONFESSED'`) pour appliquer automatiquement un malus de points à la fin.
- **Option 2 : NIER**
  - L'accusé nie l'accusation.
  - **Aucune donnée ou état n'est enregistré dans Firebase.** L'accusation est simplement ignorée dans les structures de données en temps réel. La confrontation et le vote de vérité se feront de vive voix lors du Tribunal final.

---

## 3. Le Tribunal des Espions (Fin de Mission)

Une fois le temps écoulé, le jeu passe en phase de **Tribunal** avant de dévoiler le classement final :
- **Arbitrage de l'Hôte (sans vote in-app)** : Pour préserver l'ambiance et les débats face-à-face, aucun vote n'est effectué sur les téléphones. Le groupe débat à haute voix et procède à un vote physique (ex. à main levée) en cas de désaccord. L'Hôte agit comme l'arbitre final et saisit les décisions sur son écran.
- **Rôle de l'Hôte** : Un écran affiche les joueurs un par un. L'Hôte anime le tour de table : chaque joueur énonce ses défis à haute voix.
- **Validation** : L'Hôte coche pour chaque joueur :
  1. *Défi 1 Réussi ?* (Oui/Non)
  2. *Défi 2 Réussi ?* (Oui/Non)
  3. etc.
  4. *Démasqué par un autre joueur ?* (Oui/Non - coché automatiquement si le joueur a *Avoué* en cours de jeu).
- **Calcul des Points** :
  - Défi réussi et non démasqué : `+10 points` par défi.
  - Défi réussi mais démasqué (avoué ou dénoncé au tribunal) : `-10 points`.
  - Mensonge avéré (le joueur prétend avoir réussi ou n'avoir pas été démasqué mais le groupe vote qu'il a menti) : `-30 points`.
- **Clôture** : L'Hôte valide, les scores définitifs sont écrits dans Firebase, et le statut passe à `FINISHED` pour ouvrir l'écran du podium final.


