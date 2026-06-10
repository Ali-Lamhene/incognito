import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentSplashScreen } from '../components/AgentSplashScreen';
import { ProfileSetupModal } from '../components/ProfileSetupModal';
import { RulesModal } from '../components/RulesModal';
import { ThemedText } from '../components/ThemedText';
import { useAppState } from '../store/appState';
import { useProfileStore } from '../store/profileStore';
import { Button } from '../components/ui/Button';

import { useSession } from '../context/SessionContext';
import { useTranslation } from '../hooks/useTranslation';
import SoundService from '../services/SoundService';

// Refactored Subcomponents
import { AgentHeader } from '../components/AgentHeader';
import { AgentHomeBackground } from '../components/AgentHomeBackground';
import { DossierFrame } from '../components/DossierFrame';
import { SideDataStream } from '../components/SideDataStream';

export default function AgentHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, clearSession } = useSession();
  const { hasLaunched, setHasLaunched } = useAppState();
  const { profile, isFirstSetupDone, createProfile, updateProfile } = useProfileStore();
  const { t } = useTranslation();

  // Show splash only if app hasn't launched yet
  const [showSplash, setShowSplash] = useState(!hasLaunched);
  // Show setup only if splash is done AND profile not set
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    // If not showing splash and profile not setup, show modal
    if (!showSplash && !isFirstSetupDone) {
      setShowProfileSetup(true);
    }
  }, [showSplash, isFirstSetupDone]);

  useEffect(() => {
    if (!showSplash) {
      // Start ambient music
      SoundService.playBackgroundMusic('HOME_AMBIENT');

      if (!hasLaunched) setHasLaunched(); // Mark as launched once splash is gone or skipped
    }
  }, [showSplash, hasLaunched, setHasLaunched]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setHasLaunched();
    if (!isFirstSetupDone) {
      setShowProfileSetup(true);
    }
  };

  const handleProfileComplete = (codename: string, avatar: string, color: string) => {
    if (profile) {
      updateProfile({ codename, avatar, themeColor: color });
    } else {
      createProfile(codename, avatar, color);
    }
    setShowProfileSetup(false);
  };

  if (showSplash) {
    return <AgentSplashScreen onComplete={handleSplashFinish} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <Image
        source={require('../assets/UI/incognito_logo.png')}
        style={styles.logoImage}
        contentFit="contain"
      />

      <View style={styles.buttonContainer}>
        {session ? (
          <>
            <Button
              title="Retourner au salon"
              variant="primary"
              icon="arrow-forward-circle"
              onPress={() => router.push(`/lobby/${session.code}`)}
            />
            <Button
              title="Abandonner la mission"
              variant="secondary"
              icon="exit-outline"
              onPress={async () => {
                await clearSession(profile?.id);
              }}
            />
          </>
        ) : (
          <>
            <Button
              title="Créer une partie"
              variant="primary"
              icon="person-add"
              onPress={() => router.push('/mission/create')}
            />
            <Button
              title="Rejoindre une partie"
              variant="secondary"
              icon="people"
              onPress={() => router.push('/mission/join')}
            />
          </>
        )}
      </View>

      {/* <ProfileSetupModal
        visible={showProfileSetup}
        onComplete={handleProfileComplete}
        initialData={profile ? { codename: profile.codename, avatar: profile.avatar, color: profile.themeColor } : undefined}
      />
      
      <RulesModal
        visible={showRules}
        onClose={() => setShowRules(false)}
      /> */}

      {/* BACKGROUND: Blurred Secret Agent Desk & Telemetry Scanline */}
      {/* <AgentHomeBackground />

      <View style={styles.tabletCenteredContainer}>
        <View style={[
          styles.mainContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: 15,
            paddingRight: 15,
          }
        ]}> */}
          {/* HEADER: Technical Telemetry */}
          {/* <AgentHeader
            profile={profile}
            onProfilePress={() => setShowProfileSetup(true)}
            onSettingsPress={() => router.push('/settings')}
            onRulesPress={() => setShowRules(true)}
          /> */}

          {/* CENTRAL: Augmented Reality Dossier */}
          {/* <DossierFrame session={session} /> */}


          {/* BOTTOM: Mission Deployment */}
          {/* Active buttons are now defined responsively below the logo */}


          {/* DATA OVERLAY: Side Stream */}
          {/* <SideDataStream /> */}
        {/* </View> */}
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoImage: {
    width: '85%',
    maxWidth: 400,
    aspectRatio: 860 / 264,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonContainer: {
    marginTop: 'auto',
    width: '85%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 40,
  },
  tabletCenteredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    width: '100%',
    maxWidth: 1100,
    maxHeight: 1000,
    flex: 1,
    paddingHorizontal: 35,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});
