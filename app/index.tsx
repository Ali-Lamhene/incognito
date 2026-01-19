import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentSplashScreen } from '../components/AgentSplashScreen';
import { IncognitoLogo } from '../components/IncognitoLogo';
import { MainButton } from '../components/MainButton';
import { ProfileSetupModal } from '../components/ProfileSetupModal';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useAppState } from '../store/appState';
import { useProfileStore } from '../store/profileStore';

import { useSession } from '../context/SessionContext';

// ... inside AgentHomeScreen ...

export default function AgentHomeScreen() {
  const router = useRouter();
  const { height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { hasLaunched, setHasLaunched } = useAppState();
  const { profile, isFirstSetupDone, createProfile, updateProfile } = useProfileStore();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Show splash only if app hasn't launched yet
  const [showSplash, setShowSplash] = useState(!hasLaunched);
  // Show setup only if splash is done AND profile not set
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const missionIdDisplay = session ? session.code : "NO_ACTIVE_MISSION";
  const missionStatus = session ? "IN_PROGRESS" : "CLASSIFIED_ACCESS";

  // ... shared values ...
  const contentOpacity = useSharedValue(0);
  const dataScrollY = useSharedValue(0);
  const scannerTranslateY = useSharedValue(0);
  const scanlineY = useSharedValue(-height);

  useEffect(() => {
    // If not showing splash and profile not setup, show modal
    if (!showSplash && !isFirstSetupDone) {
      setShowProfileSetup(true);
    }
  }, [showSplash, isFirstSetupDone]);

  useEffect(() => {
    if (!showSplash) {
      if (!hasLaunched) setHasLaunched(); // Mark as launched once splash is gone or skipped

      contentOpacity.value = withTiming(1, { duration: 1000 });
      // ... rest of animations
      dataScrollY.value = withRepeat(
        withTiming(-200, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      );

      // Global scanline animation
      scanlineY.value = withRepeat(
        withTiming(height, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [showSplash]);

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

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanlineY.value }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const animatedDataStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dataScrollY.value }],
  }));


  // ... (inside AgentHomeScreen)

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
      {/* BACKGROUND: Blurred Secret Agent Desk - Edge to Edge */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../assets/images/agent_silhouette_rain.png')}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.backgroundOverlay} />

        {/* Manual HUD Grid */}
        <View style={styles.hudGrid}>
          {[...Array(6)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 15}%` }]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 15}%` }]} />
          ))}
        </View>

        {/* Moving Scanline */}
        <Animated.View style={[styles.atmosphereScanline, scanlineStyle]} />

        <Image
          source={require('../assets/images/tactical_texture.png')}
          style={styles.tacticalOverlay}
          contentFit="cover"
        />
      </View>

      <Animated.View style={[
        styles.mainContent,
        animatedContentStyle,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingLeft: 15,
          paddingRight: 15,
        }
      ]}>
        {/* HEADER: Technical Telemetry */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowProfileSetup(true)}
            style={styles.logoGroup}
          >
            <View style={[styles.headerLogoRing, { borderColor: '#FFF' }]}>
              {profile?.avatar ? (
                <Ionicons name={profile.avatar as any} size={20} color="#FFF" />
              ) : (
                <Image
                  source={require('../assets/images/incognito_logo.png')}
                  style={styles.headerLogo}
                  contentFit="contain"
                />
              )}
            </View>
            <View style={styles.agentInfo}>
              <ThemedText type="code" style={styles.headerLabel}>AGENT_ACTIVE</ThemedText>
              <ThemedText type="futuristic" style={[styles.agentName, { color: '#FFF' }]}>
                {profile?.codename ? `#${profile.codename}` : "UNKNOWN"}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={styles.telemetryGroup}>
            <ThemedText type="code" style={styles.telemetryValue}>SIG: 100%</ThemedText>
            <View style={styles.signalBadge}>
              <View style={[styles.pulseDot, { backgroundColor: '#FFF' }]} />
              <ThemedText type="code" style={{ color: '#FFF', fontSize: 8 }}>EN_LIGNE</ThemedText>
            </View>
          </View>
        </View>

        {/* CENTRAL: Augmented Reality Dossier */}
        <View style={styles.centerSection}>
          <View style={styles.augmentedFrame}>
            {/* Pro Corner Brackets */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            {/* Tactical Borders */}
            <View style={styles.tacticalBorderT} />
            <View style={styles.tacticalBorderB} />

            <View style={styles.scannerLineContainer}>
              <Animated.View style={[styles.scannerLine, {
                transform: [{ translateY: scannerTranslateY.value }]
              }]} />
            </View>

            <View style={styles.brandingGroup}>
              <IncognitoLogo size={55} color="#FFFFFF" style={styles.mainLogo} />

              <View style={styles.tacticalTitleStrip}>
                {"INCOGNITO".split("").map((char, i) => (
                  <View
                    key={i}
                    style={[
                      styles.letterBlock,
                      {
                        backgroundColor: i % 2 === 0 ? '#000' : '#FFF',
                        transform: [
                          { rotate: `${(i % 3 - 1) * 4}deg` },
                          { translateY: (i % 2 === 0 ? -2 : 2) }
                        ],
                        borderWidth: 1,
                        borderColor: i % 2 === 0 ? '#333' : '#000',
                      }
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.stripLetter,
                        {
                          color: i % 2 === 0 ? '#FFF' : '#000',
                          fontFamily: i % 3 === 0 ? 'serif' : 'monospace',
                        }
                      ]}
                    >
                      {char}
                    </ThemedText>
                  </View>
                ))}
              </View>

              <View style={styles.brandingFooter}>
                <ThemedText type="code" style={styles.classTag}>
                  MISSION_ID: #{session ? session.code : "INFIL-9"} // {session ? "IN_PROGRESS" : "CLASSIFIED_ACCESS"}
                </ThemedText>
              </View>

              <ThemedText type="futuristic" style={styles.systemTag}>SOCIAL DETECTION ENGINE</ThemedText>
            </View>

            <View style={styles.frameMetadata}>
              <ThemedText type="code" style={styles.frameMetaText}>LOC_48.8566_2.3522</ThemedText>
              <ThemedText type="code" style={styles.frameMetaText}>THREAT_LEVEL: STABLE</ThemedText>
            </View>
          </View>
        </View>

        {/* BOTTOM: Mission Deployment */}
        <View style={styles.actionSection}>
          <View style={[styles.deployBadge, session && { borderColor: 'rgba(255, 255, 255, 0.3)' }]}>
            <ThemedText type="code" style={[styles.deployLabel, session && { color: 'rgba(255, 255, 255, 0.5)' }]}>
              {session ? `ACTIVE_PROTOCOL: ${session.code}` : 'DEPLOYMENT_PROTOCOL'}
            </ThemedText>
          </View>

          {session ? (
            <MainButton
              title="RETOURNER AU SALON"
              onPress={() => router.push(`/lobby/${session.code}`)}
              style={[styles.primaryAction, { borderColor: 'rgba(255, 255, 255, 0.5)' }]}
            />
          ) : (
            <MainButton
              title="CRÉER UNE MISSION"
              onPress={() => router.push('/mission/create')}
              style={styles.primaryAction}
            />
          )}

          {!session && (
            <MainButton
              title="REJOINDRE L'INFILTRATION"
              variant="outline"
              onPress={() => console.log('Join')}
              style={styles.secondaryAction}
            />
          )}
        </View>

        {/* DATA OVERLAY: Side Stream */}
        <View style={styles.sideDataOverlay}>
          <Animated.View style={animatedDataStyle}>
            {Array.from({ length: 25 }).map((_, i) => (
              <ThemedText key={i} type="code" style={styles.driftText}>
                {`>> ${Math.random().toString(16).slice(2, 8).toUpperCase()} // OK`}
              </ThemedText>
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 8, 0.75)',
  },
  tacticalOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  hudGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.015,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFF',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFF',
  },
  atmosphereScanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 35, // Increased padding to avoid edges
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLogoRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  agentInfo: {
    gap: 0,
  },
  headerLabel: {
    fontSize: 8,
    opacity: 0.4,
  },
  agentName: {
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 1,
  },
  telemetryGroup: {
    alignItems: 'flex-end',
    gap: 4,
  },
  telemetryValue: {
    fontSize: 8,
    opacity: 0.3,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pulseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  augmentedFrame: {
    width: '100%',
    paddingVertical: 45,
    paddingHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cornerTL: {
    position: 'absolute',
    top: 10,
    left: '12%',
    width: 6,
    height: 6,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#FFF',
    opacity: 0.5,
  },
  cornerTR: {
    position: 'absolute',
    top: 10,
    right: '12%',
    width: 6,
    height: 6,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFF',
    opacity: 0.5,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 10,
    left: '12%',
    width: 6,
    height: 6,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#FFF',
    opacity: 0.5,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 10,
    right: '12%',
    width: 6,
    height: 6,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFF',
    opacity: 0.5,
  },
  tacticalBorderT: {
    position: 'absolute',
    top: 5,
    left: '15%',
    width: 20,
    height: 2,
    backgroundColor: '#FFF',
    opacity: 0.4,
  },
  tacticalBorderB: {
    position: 'absolute',
    bottom: 5,
    right: '15%',
    width: 20,
    height: 2,
    backgroundColor: '#FFF',
    opacity: 0.4,
  },
  scannerLineContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scannerLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  brandingGroup: {
    alignItems: 'center',
    gap: 0,
  },
  tacticalTitleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  letterBlock: {
    width: 24,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
  },
  stripLetter: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 0,
  },
  mainLogo: {
    width: 55,
    height: 55,
    marginBottom: 0,
  },
  brandingFooter: {
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 2,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 15,
  },
  classTag: {
    fontSize: 7,
    opacity: 0.3,
    letterSpacing: 1,
  },
  heroLine: {
    width: 25,
    height: 1,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  systemTag: {
    fontSize: 10,
    opacity: 0.4,
    letterSpacing: 3,
  },
  frameMetadata: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  frameMetaText: {
    fontSize: 7,
    opacity: 0.2,
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
    height: 65,
  },
  secondaryAction: {
    height: 65,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sideDataOverlay: {
    position: 'absolute',
    right: 10,
    top: 150,
    height: 300,
    width: 100,
    opacity: 0.15,
  },
  driftText: {
    fontSize: 7,
    marginBottom: 4,
    color: '#FFF',
  },
});
