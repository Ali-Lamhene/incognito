import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Tableau contenant les assets de vos personnages individuels pour l'affichage dynamique
const SPY_CHARACTERS = [
  {
    id: 'standard',
    name: 'AGENT STANDARD',
    image: require('../../assets/images/davinci_a_character_illustration_of_a_spy_for_a_mobile_gam.png'),
  },
  {
    id: 'double',
    name: 'AGENT DOUBLE',
    image: require('../../assets/images/davinci_sur_fond_blanc_completement__uniquement_le_personn.png'),
  },
  {
    id: 'profiler',
    name: 'LE PROFILEUR',
    image: require('../../assets/images/davinci_a_character_illustration_of_a_spy_for_a_mobile_gam (1).png'),
  },
  {
    id: 'propaganda',
    name: 'PROPAGANDE',
    image: require('../../assets/images/davinci_a_character_illustration_of_a_spy_for_a_mobile_gam (2).png'),
  },
];

export default function HomeScreen() {
  const [currentCharacter, setCurrentCharacter] = useState(SPY_CHARACTERS[0]);

  // Alterne le personnage central toutes les 5 secondes pour animer l'UI
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => {
        const currentIndex = SPY_CHARACTERS.findIndex((c) => c.id === prev.id);
        const nextIndex = (currentIndex + 1) % SPY_CHARACTERS.length;
        return SPY_CHARACTERS[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* 1. HEADER TACTIQUE : Identité de l'agent connecté */}
      <View style={styles.header}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={16} color="black" />
          </View>
          <View>
            <Text style={styles.profileLabel}>IDENT : OPERATIVE</Text>
            <Text style={styles.profileName}>AGENT_404</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Ionicons name="settings-sharp" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 2. LOGO PRINCIPAL (Inspiré de votre charte graphique) */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>INCOGNITO</Text>
        <Text style={styles.logoSubtitle}>// Secure Social Deduction Protocol //</Text>
      </View>

      {/* 3. ZONE HÉROS : Un personnage central mis en valeur qui change dynamiquement */}
      <View style={styles.heroContainer}>
        {/* Cercles radar concentriques discrets en arrière-plan */}
        <View style={styles.radarCircleBackground}>
          <View style={styles.radarCircleInner} />
        </View>

        {/* Conteneur de l'image de l'agent */}
        <View style={styles.imageWrapper}>
          <Image
            source={currentCharacter.image}
            style={styles.spyImage}
            resizeMode="contain"
          />
        </View>

        {/* Badge du statut du personnage affiché */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            STATUS: MONITORING_{currentCharacter.id.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* 4. ACTIONS : Style Néo-Brutaliste (Gros blocs avec ombres dures) */}
      <View style={styles.actionsContainer}>
        
        {/* BOUTON REJOINDRE (Action principale : Jaune Moutarde de la maquette) */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[styles.buttonBase, styles.buttonJoin]}
        >
          <Ionicons name="scan-sharp" size={24} color="black" style={styles.buttonIcon} />
          <Text style={[styles.buttonText, styles.textBlack]}>
            REJOINDRE MISSION
          </Text>
        </TouchableOpacity>

        {/* BOUTON CRÉER (Action secondaire : Rouge Cramoisi de la maquette) */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[styles.buttonBase, styles.buttonCreate]}
        >
          <Ionicons name="add-circle-sharp" size={22} color="white" style={styles.buttonIcon} />
          <Text style={[styles.buttonText, styles.textWhite]}>
            CRÉER UNE MISSION
          </Text>
        </TouchableOpacity>

      </View>

      {/* 5. FOOTER PROTOCOLE */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CRYPTO-NETWORK ACTIVE V2.0 // NO DATA LEAK
        </Text>
      </View>
    </SafeAreaView>
  );
}

// "CSS" Standard de React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1b1e', // Le fameux bleu canard très sombre de l'image DaVinci
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132d32',
    borderWidth: 2,
    borderColor: '#1c3f46',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e1b12c', // Jaune moutarde pour l'accent
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 12,
  },
  profileLabel: {
    color: '#8395a7',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },
  profileName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    backgroundColor: '#132d32',
    borderWidth: 2,
    borderColor: '#1c3f46',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoText: {
    color: '#f5f6fa',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    ...Platform.select({
      ios: { fontFamily: 'Georgia-BoldItalic' },
      android: { fontFamily: 'serif' }
    }),
  },
  logoSubtitle: {
    color: '#e1b12c',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginVertical: 16,
    position: 'relative',
  },
  radarCircleBackground: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: 'rgba(19, 45, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(28, 63, 70, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircleInner: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    borderWidth: 1,
    borderColor: 'rgba(28, 63, 70, 0.1)',
  },
  imageWrapper: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spyImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    backgroundColor: '#132d32',
    borderWidth: 1,
    borderColor: '#1c3f46',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
  },
  statusBadgeText: {
    color: '#e1b12c',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonBase: {
    width: '100%',
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonJoin: {
    backgroundColor: '#e1b12c', // Jaune moutarde
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 6 }, // Ombre dure épaisse pour l'action principale
    elevation: 6, // Fallback Android
  },
  buttonCreate: {
    backgroundColor: '#c23616', // Rouge cramoisi
    paddingVertical: 14,
    marginTop: 18,
    shadowOffset: { width: 0, height: 4 }, // Ombre légèrement plus fine
    elevation: 4, // Fallback Android
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textBlack: {
    color: 'black',
  },
  textWhite: {
    color: 'white',
  },
  footer: {
    borderTopWidth: 2,
    borderColor: '#132d32',
    paddingVertical: 12,
    backgroundColor: '#081416',
    alignItems: 'center',
  },
  footerText: {
    color: '#485460',
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1.5,
  },
});