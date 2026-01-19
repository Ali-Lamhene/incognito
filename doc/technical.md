# Architecture Technique

## Stack Technologique
- **Frontend** : React Native avec Expo (SDK 51+).
- **Navigation** : Expo Router.
- **State Management** : React Context ou Zustand (pour la simplicité).
- **Backend / Real-time** : 
    - Option A : Firebase Realtime Database / Firestore (Simple, rapide à setup).
    - Option B : Supabase (PostgreSQL + Realtime).
    - Option C : Socket.io avec un serveur Node.js personnalisé.
    - *Recommandation* : **Firebase** pour la gestion des salons et de la présence temps réel sans gérer de serveur.

## Structure du Projet
- `/app` : Fichiers Expo Router (écrans).
- `/components` : Composants réutilisables (Boutons, Modales, Listes).
- `/hooks` : Logique personnalisée (ex: `useGame`, `useLobby`).
- `/constants` : Couleurs, styles, types de défis.
- `/services` : API, configuration Firebase/Backend.

## Points de Vigilance
- **Synchronisation Temps Réel** : Crucial pour le lobby et les notifications de "démasquage".
- **Persistance des données** : Si l'utilisateur ferme l'app, il doit pouvoir revenir dans la partie.
- **Sécurité** : Les défis des autres ne doivent pas être accessibles via l'API/State aux autres clients (prévention de la triche).
