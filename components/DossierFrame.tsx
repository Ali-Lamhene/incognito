import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { IncognitoLogo } from './IncognitoLogo';
import { ThemedText } from './ThemedText';

interface DossierFrameProps {
  session?: {
    code: string;
  } | null;
}

export function DossierFrame({ session }: DossierFrameProps) {
  const { t } = useTranslation();
  const scannerTranslateY = useSharedValue(0);

  useEffect(() => {
    // AR Scanner line animation
    scannerTranslateY.value = withRepeat(
      withTiming(250, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [scannerTranslateY]);

  const scannerLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scannerTranslateY.value }],
  }));

  return (
    <Animated.View entering={FadeIn.delay(1200).duration(1000)} style={styles.centerSection}>
      <View style={styles.augmentedFrame}>
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        <View style={styles.tacticalBorderT} />
        <View style={styles.tacticalBorderB} />

        <View style={styles.scannerLineContainer}>
          <Animated.View style={[styles.scannerLine, scannerLineStyle]} />
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
              {`${t('results.report_id')}: #${session ? session.code : 'INFIL-9'} // ${session ? t('mission.op_in_progress') : 'CLASSIFIED_ACCESS'}`}
            </ThemedText>
          </View>

          <ThemedText type="futuristic" style={styles.systemTag}>SOCIAL DETECTION ENGINE</ThemedText>
        </View>

        <View style={styles.frameMetadata}>
          <ThemedText type="code" style={styles.frameMetaText}>LOC_48.8566_2.3522</ThemedText>
          <ThemedText type="code" style={styles.frameMetaText}>THREAT_LEVEL: STABLE</ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
});
