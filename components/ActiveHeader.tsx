import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface ActiveHeaderProps {
  code?: string;
  credits: number;
  agentName?: string;
}

export function ActiveHeader({ code, credits, agentName }: ActiveHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Header Stratégique */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.header}
      >
        <View>
          <ThemedText type="code" style={styles.missionLabel}>
            {t("mission.op_in_progress")}
          </ThemedText>
          <View style={styles.codeContainer}>
            <View style={styles.pulseDot} />
            <ThemedText type="futuristic" style={styles.missionCode}>
              {code}
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Section Score Élargie */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.scoreOverviewSection}
      >
        <View style={styles.scoreBadgeGlowLarge} />
        <View style={styles.personalScoreBoxLarge}>
          <ThemedText type="code" style={styles.scoreLabelLarge}>
            {t("mission.mission_credits")}
          </ThemedText>
          <ThemedText type="futuristic" style={styles.scoreValueLarge}>
            {credits}
          </ThemedText>
          <View style={styles.scoreStatusIndicator}>
            <View
              style={[styles.statusDot, { backgroundColor: "#4CAF50" }]}
            />
            <ThemedText type="code" style={styles.statusText}>
              #{agentName?.toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  missionLabel: {
    fontSize: 10,
    opacity: 0.5,
    letterSpacing: 2,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  missionCode: {
    fontSize: 24,
    color: "#FFF",
  },
  scoreOverviewSection: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  scoreBadgeGlowLarge: {
    position: "absolute",
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.08)",
    borderRadius: 20,
    filter: "blur(20px)" as any, // Blur filter cast for react-native
  },
  personalScoreBoxLarge: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  scoreLabelLarge: {
    fontSize: 9,
    color: "#4CAF50",
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 8,
  },
  scoreValueLarge: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "900",
    textShadowColor: "rgba(76, 175, 80, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  scoreStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 7,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
  },
});
