import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentSplashScreen } from '../components/AgentSplashScreen';
import { MainButton } from '../components/MainButton';
import { ProfileSetupModal } from '../components/ProfileSetupModal';
import { RulesModal } from '../components/RulesModal';
import { ThemedText } from '../components/ThemedText';
import { useAppState } from '../store/appState';
import { useProfileStore } from '../store/profileStore';

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
    <View style={styles.container}>
      <ProfileSetupModal
        visible={showProfileSetup}
        onComplete={handleProfileComplete}
        initialData={profile ? { codename: profile.codename, avatar: profile.avatar, color: profile.themeColor } : undefined}
      />
      
      <RulesModal
        visible={showRules}
        onClose={() => setShowRules(false)}
      />

      {/* BACKGROUND: Blurred Secret Agent Desk & Telemetry Scanline */}
      <AgentHomeBackground />

      <View style={styles.tabletCenteredContainer}>
        <View style={[
          styles.mainContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: 15,
            paddingRight: 15,
          }
        ]}>
          {/* HEADER: Technical Telemetry */}
          <AgentHeader
            profile={profile}
            onProfilePress={() => setShowProfileSetup(true)}
            onSettingsPress={() => router.push('/settings')}
            onRulesPress={() => setShowRules(true)}
          />

          {/* CENTRAL: Augmented Reality Dossier */}
          <DossierFrame session={session} />

          {/* BOTTOM: Mission Deployment */}
          <Animated.View entering={FadeInUp.delay(1600).duration(800)} style={styles.actionSection}>
            <View style={[styles.deployBadge, session && { borderColor: 'rgba(255, 255, 255, 0.3)' }]}>
              <ThemedText type="code" style={[styles.deployLabel, session && { color: 'rgba(255, 255, 255, 0.5)' }]}>
                {session ? `${t('home.active_protocol')}: ${session.code}` : t('home.deployment_protocol')}
              </ThemedText>
            </View>

            {session ? (
              <>
                <MainButton
                  title={t('home.return_to_lobby')}
                  onPress={() => router.push(`/lobby/${session.code}`)}
                  style={[styles.primaryAction, { borderColor: 'rgba(255, 255, 255, 0.5)' }]}
                />
                <MainButton
                  title={t('home.abort_mission')}
                  variant="outline"
                  onPress={async () => {
                    await clearSession();
                  }}
                  style={[styles.secondaryAction, { marginTop: 10, borderColor: 'rgba(255, 107, 107, 0.3)' }]}
                />
              </>
            ) : (
              <>
                <MainButton
                  title={t('home.create_mission_title')}
                  onPress={() => router.push('/mission/create')}
                  style={styles.primaryAction}
                />
                <MainButton
                  title={t('home.join_mission_subtitle')}
                  variant="outline"
                  onPress={() => router.push('/mission/join')}
                  style={[styles.secondaryAction, { marginTop: 10 }]}
                />
              </>
            )}
          </Animated.View>

          {/* DATA OVERLAY: Side Stream */}
          <SideDataStream />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  actionSection: {
    gap: 2,
    marginBottom: 20,
  },
  deployBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  deployLabel: {
    fontSize: 8,
    opacity: 0.4,
    letterSpacing: 2,
  },
  primaryAction: {
    backgroundColor: '#FFF',
    height: 35,
    marginBottom: 30,
  },
  secondaryAction: {
    height: 35,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 30,
  },
});
