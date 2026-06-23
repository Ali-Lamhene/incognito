# Spécifications de l'Écran des Règles (Mockup V2)

Ce document décrit l'interface visuelle et le contenu textuel de l'écran **RÈGLES** d'Incognito, tel que présenté dans la maquette graphique.

---

## 🎨 Design Visuel & Thème
*   **Couleur de fond** : Noir profond (`#000000`).
*   **Palette de couleurs** :
    *   Rouge vif/sombre (accents, titres, boutons, icônes) : `#8B1E1E` / `#FF3B30`
    *   Sable/Crème (textes secondaires, titres des cartes) : `#F2E8CF`
    *   Vert (points positifs) : `#4CD964` / Vert clair
*   **Typographie** : Bebas Neue (ou similaire) pour les titres en capitales, police sans-serif lisible pour les descriptions.
*   **Structure** : Défilement vertical avec 5 cartes descriptives au contour fin gris foncé et une citation de fin.

---

## 📄 Contenu Textuel de l'Écran

### 1. En-tête (Header)
*   **Bouton Retour** : Flèche vers la gauche en haut à gauche.
*   **Titre Principal** : `RÈGLES` (en rouge, grandes capitales). Un petit logo d'espion (chapeau + lunettes) est centré sous le titre.
*   **Illustration Héro** : Deux espions en trench-coat et chapeau fedora espionnant dans une ville nocturne.
*   **Accroche** : *"Accomplissez vos **missions secrètes** sans vous faire démasquer."* (Le texte "missions secrètes" est en rouge).

---

### 2. Cartes de Règles (1 à 5)

#### 🎯 Card 1 : 1. VOTRE MISSION
*   **Icône gauche** : Cible rouge.
*   **Contenu** :
    *   Des missions secrètes sont affectées à chaque joueur.
    *   Accomplissez-les dans le temps imparti.
    *   Chaque mission accomplie rapporte **10 points** (en rouge).
*   **Visuel droit** : Dossier confidentiel kraft fermé, estampillé *"TOP SECRET"*.

---

#### 🕵️ Card 2 : 2. RESTEZ INCÒGNITO
*   **Icône gauche** : Chapeau fedora et lunettes d'espion en rouge.
*   **Contenu** :
    *   Chaque geste, chaque mot peut vous trahir.
    *   Ne révélez aucun indice.
    *   Fondez-vous dans la conversation et restez discret.
*   **Visuel droit** : Icône d'œil barré rouge (visibilité masquée).

---

#### 🔍 Card 3 : 3. DÉMASQUEZ LES SUSPECTS
*   **Icône gauche** : Loupe rouge.
*   **Contenu** :
    *   Vous pensez avoir repéré un agent en mission ?
    *   Décrivez précisément ce que vous avez observé.
    *   Pas besoin d'exprimer littéralement la mission exacte : identifiez le comportement suspect.
*   **Visuel droit** : Silhouette d'agent sous un viseur rouge (coins de cadrage de caméra).

---

#### 👆 Card 4 : 4. COMMENT ACCUSER ?
*   **Icône gauche** : Doit pressant un bouton/capteur rouge.
*   **Contenu (Flux séquentiel horizontal)** :
    1.  **[Icône Cible]** : Cliquez sur le bouton Démasquer.
    2.  `→`
    3.  **[Icône Espion]** : L'agent accusé peut avouer ou non.
    4.  `→`
    5.  **[Icône Bulle de Dialogue]** : Sa réponse est enregistrée dans l'app.
    6.  `→`
    7.  **[Icône Liste à puces/Clipboard]** : Les erreurs d'accusation ne font pas perdre de points. *(Note : correction de la coquille typo "accugistréo" présente sur le mockup).*

---

#### ⚖️ Card 5 : 5. LE TRIBUNAL DES ESPIONS
*   **Icône gauche** : Balance de la justice rouge.
*   **Contenu** :
    *   À la fin du temps, les missions sont révélées.
    *   Mission réussie : **+10 points** (en vert).
    *   Mission réussie mais démasquée : **-10 points** (en rouge).
    *   Si le tribunal découvre qu'un espion a menti lors d'une tentative de démasquage : **-30 points** (en rouge).
*   **Visuel droit** : Gyrophare d'alerte rouge brillant.

---

### 3. Citation de Clôture
*   **Style** : Encadré avec guillemets rouges.
*   *« La meilleure stratégie n'est pas d'être invisible, c'est de paraître totalement innocent. »* (Texte en rouge et italique).
*   **Icône droite** : Petit chapeau fedora rouge.

---

### 4. Bouton d'Action Final
*   **Style** : Grand bouton rouge rectangulaire aux bords légèrement arrondis.
*   **Icône** : Chapeau fedora blanc.
*   **Texte** : `COMPRIS, AGENT !` (en blanc, majuscules).
