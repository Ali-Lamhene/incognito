import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { Theme } from "../../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveModals } from "../../components/ActiveModals";
import { MissionCompleteSplashScreen } from "../../components/MissionCompleteSplashScreen";
import { MissionStartSplashScreen } from "../../components/MissionStartSplashScreen";
import { ThemedText } from "../../components/ThemedText";
import { ActiveHeader } from "../../components/ActiveHeader";
import { ActiveChallengeCard } from "../../components/ActiveChallengeCard";
import { ActiveAgentsList } from "../../components/ActiveAgentsList";
import { useTranslation } from "../../hooks/useTranslation";
import { useActiveMission } from "../../hooks/useActiveMission";



export default function ActiveMissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    session,
    profile,
    agents,
    status,
    now,
    me,
    myChallenge,
    isCompleted,
    timeLeft,
    isLowTime,
    isRevealed,
    setIsRevealed,
    showAbortModal,
    setShowAbortModal,
    showUnmaskModal,
    setShowUnmaskModal,
    showStartSplash,
    setShowStartSplash,
    showCompleteSplash,
    formatTime,
    targetAgentName,
    activeIndex,
    setActiveIndex,
    actions: {
      handleAbort,
      handleUnmask,
      handleConfirmUnmask,
      handleConfessAccusation,
      handleDenyAccusation,
    }
  } = useActiveMission();

  if (showStartSplash) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <Stack.Screen
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: Theme.colors.totalBlack }
          }}
        />
        <MissionStartSplashScreen onComplete={() => setShowStartSplash(false)} />
      </View>
    );
  }

  if (showCompleteSplash) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <Stack.Screen
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: Theme.colors.totalBlack }
          }}
        />
        <MissionCompleteSplashScreen onComplete={() => router.replace("/mission/results")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          animation: 'fade',
          contentStyle: { backgroundColor: Theme.colors.totalBlack }
        }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: insets.bottom + 20 }}>
          <View>
            <View style={[styles.topHalfContainer, { paddingTop: insets.top + 20 }]}>
              <Image
                source={require("../../assets/UI/texture_city_dark.png")}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.52 }}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', Theme.colors.totalBlack]}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 250,
                  zIndex: 1,
                }}
              />
              <View style={[styles.content, { zIndex: 2 }]}>
                <ActiveHeader
                  code={session?.code}
                  agentName={me?.name}
                />

                <ActiveChallengeCard
                  me={me}
                  timeLeft={timeLeft}
                  isLowTime={isLowTime}
                  formatTime={formatTime}
                  animatedScanStyle={null}
                  isRevealed={isRevealed}
                  setIsRevealed={setIsRevealed}
                  myChallenge={myChallenge}
                  status={status}
                  now={now}
                  isCompleted={!!isCompleted}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </View>
            </View>

            <View style={styles.content}>
              <ActiveAgentsList
                agents={agents}
                profile={profile}
                handleUnmask={handleUnmask}
              />
            </View>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => setShowAbortModal(true)}
              style={styles.leaveGameButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={Theme.colors.red}
              />
              <View style={styles.leaveGameTextContainer}>
                <ThemedText style={styles.leaveGameTitle}>
                  {t("mission.leave_mission_btn")}
                </ThemedText>
                <ThemedText style={styles.leaveGameSubtitle}>
                  {t("mission.leave_mission_subtitle")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ActiveModals
          showAbortModal={showAbortModal}
          setShowAbortModal={setShowAbortModal}
          handleAbort={handleAbort}
          showUnmaskModal={showUnmaskModal}
          setShowUnmaskModal={setShowUnmaskModal}
          handleConfirmUnmask={handleConfirmUnmask}
          targetAgentName={targetAgentName}
          me={me}
          handleConfessAccusation={handleConfessAccusation}
          handleDenyAccusation={handleDenyAccusation}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.totalBlack,
  },
  topHalfContainer: {
    width: "100%",
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
    width: "100%",
    maxWidth: 1100,
    marginHorizontal: "auto",
  },
  leaveGameButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
    borderRadius: 8,
    gap: 16,
  },
  leaveGameButtonDisabled: {
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  leaveGameTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  leaveGameTitle: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 13,
    color: Theme.colors.red,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 16,
  },
  leaveGameSubtitle: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 2,
    lineHeight: 12,
  },
  leaveGameTextDisabled: {
    color: "rgba(255,255,255,0.15)",
  },
});
