import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentSplashScreen } from '../../components/AgentSplashScreen';
import { ProfileSetupModal } from '../../components/ProfileSetupModal';
import { ThemedText } from '../../components/ThemedText';
import { useAppState } from '../../store/appState';
import { useProfileStore } from '../../store/profileStore';
import { Button } from '../../components/ui/Button';

import { useSession } from '../../context/SessionContext';
import { useTranslation } from '../../hooks/useTranslation';
import SoundService from '../../services/SoundService';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/Theme';

export default function AgentHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, clearSession } = useSession();
  const { hasLaunched, setHasLaunched, showProfileModal, setShowProfileModal } = useAppState();
  const { profile, isFirstSetupDone, createProfile, updateProfile } = useProfileStore();
  const { t } = useTranslation();

  const [showSplash, setShowSplash] = useState(!hasLaunched);

  useEffect(() => {
    if (!showSplash && !isFirstSetupDone) {
      setShowProfileModal(true);
    }
  }, [showSplash, isFirstSetupDone]);

  useEffect(() => {
    if (!showSplash) {
      SoundService.playBackgroundMusic('HOME_AMBIENT');
      if (!hasLaunched) setHasLaunched();
    }
  }, [showSplash, hasLaunched, setHasLaunched]);

  const handleSplashFinish = () => {
    // setShowSplash(false);
    setHasLaunched();
    if (!isFirstSetupDone) {
      setShowProfileModal(true);
    }
  };

  const handleProfileComplete = (codename: string, avatar: string, color: string) => {
    if (profile) {
      updateProfile({ codename, avatar, themeColor: color });
    } else {
      createProfile(codename, avatar, color);
    }
    setShowProfileModal(false);
  };

  // if (showSplash) {
  //   return <AgentSplashScreen onComplete={handleSplashFinish} />;
  // }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 15, paddingBottom: 105 + insets.bottom }]}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/UI/home_hero.png')}
          style={styles.heroImage}
          contentFit="cover"
          contentPosition={{ top: '28%', left: '50%' }}
        />
        <LinearGradient
          colors={[Theme.colors.totalBlack, 'transparent']}
          style={styles.topGradientOverlay}
        />
        <LinearGradient
          colors={['transparent', Theme.colors.totalBlack]}
          style={styles.gradientOverlay}
        />
        <Image
          source={require('../../assets/UI/incognito_logo.png')}
          style={styles.logoImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        {session ? (
          <>
            <Button
              title={t('home.return_to_lobby')}
              variant="primary"
              icon="arrow-forward-circle"
              onPress={() => router.push(`/lobby/${session.code}`)}
            />
            <Button
              title={t('home.abort_mission')}
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
              title={t('home.create_mission_title')}
              variant="primary"
              icon="person-add"
              onPress={() => router.push('/mission/create')}
            />
            <Button
              title={t('join.title')}
              variant="secondary"
              icon="people"
              onPress={() => router.push('/mission/join')}
            />
          </>
        )}
      </View>

      <ProfileSetupModal
        visible={showProfileModal}
        onComplete={handleProfileComplete}
        onClose={() => setShowProfileModal(false)}
        initialData={profile ? { codename: profile.codename, avatar: profile.avatar, color: profile.themeColor } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.totalBlack,
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  logoImage: {
    position: 'absolute',
    top: 25,
    width: '85%',
    maxWidth: 380,
    aspectRatio: 860 / 264,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
    width: '85%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
