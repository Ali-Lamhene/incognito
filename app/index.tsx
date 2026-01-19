import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { AgentSplashScreen } from '../components/AgentSplashScreen';
import { IncognitoLogo } from '../components/IncognitoLogo';
import { MainButton } from '../components/MainButton';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function AgentHomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showSplash, setShowSplash] = useState(true);

  // Animation shared values
  const contentOpacity = useSharedValue(0);
  const dataScrollY = useSharedValue(0);
  const scannerTranslateY = useSharedValue(0);

  useEffect(() => {
    if (!showSplash) {
      contentOpacity.value = withTiming(1, { duration: 1000 });
      // Infinite data drift animation
      dataScrollY.value = withRepeat(
        withTiming(-200, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [showSplash]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const animatedDataStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dataScrollY.value }],
  }));

  if (showSplash) {
    return <AgentSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND: Blurred Secret Agent Desk */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../assets/images/surveillance_target_v4.png')}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.backgroundOverlay} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.mainContent, animatedContentStyle]}>

          {/* HEADER: Technical Telemetry */}
          <View style={styles.header}>
            <View style={styles.logoGroup}>
              <Image
                source={require('../assets/images/incognito_logo.png')}
                style={styles.headerLogo}
                contentFit="contain"
              />
              <View style={styles.agentInfo}>
                <ThemedText type="code" style={styles.headerLabel}>AGENT_STATUS</ThemedText>
                <ThemedText type="futuristic" style={styles.agentName}>#RX_CORTEX</ThemedText>
              </View>
            </View>
            <View style={styles.telemetryGroup}>
              <ThemedText type="code" style={styles.telemetryValue}>SIG: 100%</ThemedText>
              <View style={styles.signalBadge}>
                <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
                <ThemedText type="code" style={{ color: colors.primary, fontSize: 8 }}>EN_LIGNE</ThemedText>
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
                  <ThemedText type="code" style={styles.classTag}>MISSION_ID: #INFIL-9 // CLASSIFIED_ACCESS</ThemedText>
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
            <View style={styles.deployBadge}>
              <ThemedText type="code" style={styles.deployLabel}>DEPLOYMENT_PROTOCOL</ThemedText>
            </View>

            <MainButton
              title="CRÉER UNE MISSION"
              onPress={() => console.log('Create')}
              style={styles.primaryAction}
            />
            <MainButton
              title="REJOINDRE L'INFILTRATION"
              variant="outline"
              onPress={() => console.log('Join')}
              style={styles.secondaryAction}
            />
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
      </SafeAreaView>
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
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
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
    gap: 12,
  },
  headerLogo: {
    width: 32,
    height: 32,
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
    gap: 12,
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
