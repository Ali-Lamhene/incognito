# Incognito 🕵️‍♂️

**Incognito** est un jeu mobile de "Social Deduction" développé avec React Native et Expo.

## 🌟 Concept

Le but est simple : accomplir des défis secrets sans se faire repérer par les autres joueurs. 

Imaginez une soirée entre amis : chacun reçoit une mission secrète sur son téléphone (ex: "Changer de place avec quelqu'un", "Utiliser le mot 'Escarpin'"). Si vous réussissez votre mission sans que personne ne s'en rende compte, vous marquez des points. Si quelqu'un vous observe et appuie sur "Démasquer", c'est lui qui gagne les points !

## 🎮 Comment jouer ?

1. **Création du Salon** : Un joueur crée une partie et partage le code.
2. **Rejoindre** : Les autres joueurs rejoignent via le code.
3. **Missions** : Dès que la partie commence, chacun reçoit son défi secret.
4. **Action** : Réalisez votre défi avec subtilité.
5. **Démasquage** : Observez les autres. S'ils font quelque chose d'inhabituel, tentez de les démasquer !

## 📁 Documentation

Pour plus de détails sur la conception, consultez le dossier [`/doc`](./doc) :
- [Concept Général](./doc/concept.md)
- [Mécaniques de Jeu](./doc/mechanics.md)
- [Écrans et Navigation](./doc/screens.md)
- [Architecture Technique](./doc/technical.md)

## 🛠 Tech Stack

- **Framework** : React Native (Expo)
- **Navigation** : Expo Router
- **Temps Réel** : Firebase (projeté)
- **Langage** : TypeScript

---

## 🚀 Installation & Lancement

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le projet :
```bash
npx expo start
```
