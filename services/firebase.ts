import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

/**
 * CONFIGURATION FIREBASE - INCOGNITO
 * 
 * Sécurité & Environnement :
 * - Les clés sont chargées via des variables d'environnement (Expo EXPO_PUBLIC_).
 * - Le fichier .env contient des placeholders (versionné sur Git).
 * - Le fichier .env.local contient les clés réelles (IGNORÉ par Git pour la sécurité).
 * 
 * Pour configurer un nouvel environnement :
 * 1. Créer un fichier .env.local à la racine.
 * 2. Copier le contenu de .env et remplacer par les clés de la console Firebase.
 */

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Vérification de la configuration en développement
if (__DEV__ && !firebaseConfig.apiKey) {
    console.warn("ATTENTION : Les clés Firebase ne sont pas configurées dans .env.local");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
