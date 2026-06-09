import React from 'react';
import { View, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveChallengeCard.styles';

interface ActiveChallengeCardProps {
  me?: Agent;
  timeLeft: number;
  isLowTime: boolean;
  formatTime: (ms: number) => string;
  animatedScanStyle: any;
  isRevealed: boolean;
  setIsRevealed: (revealed: boolean) => void;
  myChallenge?: { text: string } | null;
  status: string;
  now: number;
  isCompleted: boolean;
}

export function ActiveChallengeCard({
  me,
  timeLeft,
  isLowTime,
  formatTime,
  animatedScanStyle,
  isRevealed,
  setIsRevealed,
  myChallenge,
  status,
  now,
  isCompleted,
}: ActiveChallengeCardProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800)}
      style={styles.cardContainer}
    >
      <View style={styles.terminalHeader}>
        <View style={styles.terminalDot} />
        <ThemedText type="code" style={styles.terminalTitle}>
          {t("mission.terminal_v2")}
        </ThemedText>

        <View style={[styles.timerBadgeTerminal, isLowTime && styles.timerBadgeTerminalLow]}>
          <Ionicons
            name="time-outline"
            size={10}
            color={isLowTime ? "#FF6B6B" : "rgba(255,255,255,0.5)"}
          />
          <ThemedText type="code" style={[styles.timerValueTerminal, isLowTime && { color: "#FF6B6B" }]}>
            {formatTime(timeLeft)}
          </ThemedText>
        </View>
      </View>

      <BlurView intensity={30} style={styles.blurCard}>
        {/* Decorative scan line */}
        <Animated.View style={[styles.scanLine, animatedScanStyle]} />

        <View style={styles.cardHeader}>
          <Ionicons
            name={
              isCompleted
                ? "shield-checkmark"
                : "finger-print"
            }
            size={18}
            color={
              isCompleted ? "#4CAF50" : "#FFF"
            }
          />
          <ThemedText
            type="code"
            style={[
              styles.cardTitle,
              isCompleted && { color: "#4CAF50" },
            ]}
          >
            {isCompleted
              ? `#${me?.name?.toUpperCase()}`
              : t("mission.identification_required")}
          </ThemedText>
        </View>

        <Pressable
          onPress={() =>
            !isCompleted && setIsRevealed(!isRevealed)
          }
          style={({ pressed }) => [
            styles.challengeBox,
            !isRevealed &&
            !isCompleted &&
            styles.challengeBoxHidden,
            isCompleted && styles.challengeBoxCompleted,
            pressed && !isCompleted && { opacity: 0.7 },
          ]}
        >
          {!isRevealed && !isCompleted ? (
            <Animated.View
              key="hidden"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={styles.hiddenContent}
            >
              <View style={styles.lockIconContainer}>
                <Ionicons
                  name="lock-closed"
                  size={32}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <View>
                <ThemedText style={styles.revealText}>
                  {t("mission.decryption_required")}
                </ThemedText>
                <ThemedText style={styles.revealSubtext}>
                  {t("mission.tap_to_scan")}
                </ThemedText>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              key="revealed"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={styles.challengeContent}
            >
              <View style={styles.quoteMarkTL} />
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  justifyContent: "center",
                  minHeight: "100%",
                }}
                showsVerticalScrollIndicator={false}
              >
                <ThemedText
                  style={[
                    styles.challengeText,
                    isCompleted && styles.challengeTextCompleted,
                  ]}
                >
                  {myChallenge?.text ||
                    (me
                      ? t("mission.no_objective")
                      : t("mission.searching_profile"))}
                </ThemedText>
              </ScrollView>
              <View style={styles.quoteMarkBR} />

              {!myChallenge?.text && status === "ACTIVE" && (
                <ThemedText style={styles.errorSubtext}>
                  {t("mission.contact_hq")}
                </ThemedText>
              )}

              <View style={styles.hideHint}>
                <Ionicons
                  name="eye-off-outline"
                  size={10}
                  color="rgba(255,255,255,0.3)"
                />
                <ThemedText type="code" style={styles.hideHintText}>
                  {t("mission.tap_to_secure")}
                </ThemedText>
              </View>
            </Animated.View>
          )}
        </Pressable>

        {/* Tactical corners */}
        <View style={styles.cornerL_TL} />
        <View style={styles.cornerL_TR} />
        <View style={styles.cornerL_BL} />
        <View style={styles.cornerL_BR} />
      </BlurView>
    </Animated.View>
  );
}
