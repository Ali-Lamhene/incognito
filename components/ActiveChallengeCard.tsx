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
  handleComplete: () => void;
  handleBluff: () => void;
  setShowImpossibleModal: (show: boolean) => void;
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
  handleComplete,
  handleBluff,
  setShowImpossibleModal,
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
                : me?.incident
                  ? "alert-circle"
                  : "finger-print"
            }
            size={18}
            color={
              isCompleted ? "#4CAF50" : me?.incident ? "#FF6B6B" : "#FFF"
            }
          />
          <ThemedText
            type="code"
            style={[
              styles.cardTitle,
              isCompleted && { color: "#4CAF50" },
              me?.incident && { color: "#FF6B6B" },
            ]}
          >
            {isCompleted
              ? `#${me?.name?.toUpperCase()}`
              : me?.incident
                ? t("mission.identity_suspended")
                : t("mission.identification_required")}
          </ThemedText>
        </View>

        <Pressable
          onPress={() =>
            !isCompleted && !me?.incident && setIsRevealed(!isRevealed)
          }
          style={({ pressed }) => [
            styles.challengeBox,
            !isRevealed &&
            !isCompleted &&
            !me?.incident &&
            styles.challengeBoxHidden,
            isCompleted && styles.challengeBoxCompleted,
            me?.incident && styles.challengeBoxIncident,
            pressed && !isCompleted && !me?.incident && { opacity: 0.7 },
          ]}
        >
          {me?.incident ? (
            <Animated.View
              key="incident"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={styles.hiddenContent}
            >
              <Ionicons name="hammer-outline" size={32} color="#FF6B6B" />
              <View>
                <ThemedText
                  style={[styles.revealText, { color: "#FF6B6B" }]}
                >
                  {t("mission.judgement_in_progress")}
                </ThemedText>
                <ThemedText style={styles.revealSubtext}>
                  {t("mission.judgement_msg")}
                </ThemedText>
              </View>
            </Animated.View>
          ) : !isRevealed && !isCompleted ? (
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

        {!me?.pendingValidation && !me?.completed && !me?.incident && (
          <View style={{ gap: 15 }}>
            <TouchableOpacity
              onPress={handleComplete}
              activeOpacity={0.7}
              style={styles.tacticalCompleteBtn}
            >
              <View style={styles.btnContentRow}>
                <Ionicons name="finger-print" size={20} color="#4CAF50" />
                <ThemedText
                  type="futuristic"
                  style={styles.tacticalCompleteText}
                >
                  {t("mission.complete_objective")}
                </ThemedText>
              </View>
              <View style={styles.btnCornerTL} />
              <View style={styles.btnCornerBR} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={handleBluff}
                style={[styles.bluffBtn, { flex: 1 }]}
              >
                <Ionicons name="timer-outline" size={14} color="#FFD93D" />
                <ThemedText
                  type="code"
                  style={styles.bluffBtnText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {t("mission.btn_bluff")}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowImpossibleModal(true)}
                style={[styles.impossibleBtn, { flex: 1.4 }]}
              >
                <Ionicons
                  name="flash-off"
                  size={11}
                  color="rgba(255,107,107,0.6)"
                />
                <ThemedText
                  type="code"
                  style={styles.impossibleBtnText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {t("mission.impossible_objective")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {me?.pendingValidation && (
          <View style={styles.pendingBadge}>
            <Ionicons
              name="timer-outline"
              size={16}
              color="#FFD93D"
              style={{ marginRight: 8 }}
            />
            <View>
              <ThemedText type="code" style={styles.pendingBadgeText}>
                {t("mission.verification_in_progress").replace(
                  "{{time}}",
                  Math.max(
                    0,
                    Math.floor(
                      (60000 - (now - me.pendingValidation.startedAt)) /
                      1000,
                    ),
                  ).toString(),
                )}
              </ThemedText>
              <ThemedText style={styles.pendingBadgeSub}>
                {t("mission.transfer_hq_msg")}
              </ThemedText>
            </View>
          </View>
        )}

        {me?.incident && (
          <View style={styles.incidentStatus}>
            <ThemedText type="code" style={styles.incidentStatusText}>
              {t("mission.current_score").replace(
                "{{score}}",
                (me.score || 1).toString(),
              )}
            </ThemedText>
          </View>
        )}

        {/* Tactical corners */}
        <View style={styles.cornerL_TL} />
        <View style={styles.cornerL_TR} />
        <View style={styles.cornerL_BL} />
        <View style={styles.cornerL_BR} />
      </BlurView>
    </Animated.View>
  );
}
