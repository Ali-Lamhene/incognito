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

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveModals } from "../../components/ActiveModals";
import { MissionCompleteSplashScreen } from "../../components/MissionCompleteSplashScreen";
import { MissionStartSplashScreen } from "../../components/MissionStartSplashScreen";
import { ThemedText } from "../../components/ThemedText";
import { ActiveHeader } from "../../components/ActiveHeader";
import { ActiveChallengeCard } from "../../components/ActiveChallengeCard";
import { ActiveAgentsList } from "../../components/ActiveAgentsList";
import { ActiveEventFeed } from "../../components/ActiveEventFeed";
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
    events,
    status,
    now,
    me,
    myChallenge,
    isCompleted,
    timeLeft,
    isLowTime,
    animatedScanStyle,
    visibleEvents,
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
    actions: {
      handleAbort,
      handleUnmask,
      handleConfirmUnmask,
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
        style={{ flex: 1, marginBottom: insets.bottom }}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <ImageBackground
          source={require("../../assets/UI/texture_city_dark.png")}
          style={[styles.topHalfContainer, { paddingTop: insets.top + 20 }]}
          imageStyle={{ opacity: 0.32, top: 0, height: '100%' }}
        >
          <View style={styles.content}>
            <ActiveHeader
              code={session?.code}
              agentName={me?.name}
            />

            <ActiveChallengeCard
              me={me}
              timeLeft={timeLeft}
              isLowTime={isLowTime}
              formatTime={formatTime}
              animatedScanStyle={animatedScanStyle}
              isRevealed={isRevealed}
              setIsRevealed={setIsRevealed}
              myChallenge={myChallenge}
              status={status}
              now={now}
              isCompleted={!!isCompleted}
            />
          </View>
        </ImageBackground>

        {/* <ActiveAgentsList
          agents={agents}
          profile={profile}
          now={now}
          handleUnmask={handleUnmask}
        />

        <TouchableOpacity
          onPress={() => setShowAbortModal(true)}
          style={styles.leaveGameButton}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color="rgba(139, 30, 30, 0.6)"
          />
          <ThemedText
            type="code"
            style={styles.leaveGameText}
          >
            {t("mission.leave_lobby")}
          </ThemedText>
        </TouchableOpacity>

      <ActiveEventFeed
        events={events}
        visibleEvents={visibleEvents}
        bottomInset={insets.bottom + 20}
      />

      <ActiveModals
        showAbortModal={showAbortModal}
        setShowAbortModal={setShowAbortModal}
        handleAbort={handleAbort}
        showUnmaskModal={showUnmaskModal}
        setShowUnmaskModal={setShowUnmaskModal}
        handleConfirmUnmask={handleConfirmUnmask}
      /> */}
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
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(139, 30, 30, 0.3)",
    backgroundColor: "rgba(139, 30, 30, 0.05)",
    borderRadius: 8,
  },
  leaveGameButtonDisabled: {
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  leaveGameText: {
    fontSize: 10,
    color: Theme.colors.red,
    letterSpacing: 2,
    fontWeight: "bold",
    textShadowColor: "rgba(139, 30, 30, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  leaveGameTextDisabled: {
    color: "rgba(255,255,255,0.15)",
  },
});
