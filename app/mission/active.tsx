import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveModals } from "../../components/ActiveModals";
import { MissionCompleteSplashScreen } from "../../components/MissionCompleteSplashScreen";
import { MissionStartSplashScreen } from "../../components/MissionStartSplashScreen";
import { ThemedText } from "../../components/ThemedText";
import { ActiveHeader } from "../../components/ActiveHeader";
import { ActiveChallengeCard } from "../../components/ActiveChallengeCard";
import { ActiveIncidentBanner } from "../../components/ActiveIncidentBanner";
import { ActiveAgentsList } from "../../components/ActiveAgentsList";
import { ActiveRouletteOverlay } from "../../components/ActiveRouletteOverlay";
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
    isRouletteActive,
    rouletteWinner,
    agentInIncident,
    incidentType,
    incidentVotes,
    myVote,
    countPossible,
    countFeasible,
    countYes,
    countNo,
    maxVoters,
    isRevealed,
    setIsRevealed,
    showAbortModal,
    setShowAbortModal,
    showImpossibleModal,
    setShowImpossibleModal,
    showUnmaskModal,
    setShowUnmaskModal,
    showStartSplash,
    setShowStartSplash,
    showCompleteSplash,
    formatTime,
    actions: {
      handleComplete,
      handleBluff,
      handleAbort,
      handleImpossible,
      handleVote,
      handleUnmask,
      handleConfirmUnmask,
      handleRespondToUnmask,
      handleResolveUnmaskVote,
      resolveImpossibleChallenge,
    }
  } = useActiveMission();

  if (showStartSplash) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <Stack.Screen
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#000' }
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
            contentStyle: { backgroundColor: '#000' }
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
          contentStyle: { backgroundColor: '#000' }
        }}
      />
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require("../../assets/images/suspect_photo_bg.jpg")}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      <ScrollView
        style={{ flex: 1, marginBottom: insets.bottom }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 0 },
        ]}
      >
        <ActiveHeader
          code={session?.code}
          credits={me?.score || 0}
          agentName={me?.name}
        />

        {agentInIncident && (
          <ActiveIncidentBanner
            agentInIncident={agentInIncident}
            incidentType={incidentType}
            incidentVotes={incidentVotes}
            agents={agents}
            profile={profile}
            countPossible={countPossible}
            countFeasible={countFeasible}
            countYes={countYes}
            countNo={countNo}
            myVote={myVote}
            isRouletteActive={isRouletteActive}
            maxVoters={maxVoters}
            handleVote={handleVote}
            handleRespondToUnmask={handleRespondToUnmask}
            resolveImpossibleChallenge={resolveImpossibleChallenge}
            handleResolveUnmaskVote={handleResolveUnmaskVote}
          />
        )}

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
          handleComplete={handleComplete}
          handleBluff={handleBluff}
          setShowImpossibleModal={setShowImpossibleModal}
        />

        <ActiveAgentsList
          agents={agents}
          profile={profile}
          agentInIncident={agentInIncident}
          now={now}
          handleUnmask={handleUnmask}
        />

        {/* Leave Button at the bottom */}
        <TouchableOpacity
          onPress={() => !agentInIncident && setShowAbortModal(true)}
          disabled={!!agentInIncident}
          style={[
            styles.leaveGameButton,
            !!agentInIncident && styles.leaveGameButtonDisabled,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={
              agentInIncident
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,107,107,0.6)"
            }
          />
          <ThemedText
            type="code"
            style={[
              styles.leaveGameText,
              !!agentInIncident && styles.leaveGameTextDisabled,
            ]}
          >
            {agentInIncident
              ? t("mission.voting_in_progress")
              : t("mission.leave_lobby")}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <ActiveRouletteOverlay
        isRouletteActive={isRouletteActive}
        agentInIncident={agentInIncident}
        rouletteWinner={rouletteWinner}
        agents={agents}
      />

      <ActiveEventFeed
        events={events}
        visibleEvents={visibleEvents}
        bottomInset={insets.bottom + 20}
      />

      <ActiveModals
        showAbortModal={showAbortModal}
        setShowAbortModal={setShowAbortModal}
        handleAbort={handleAbort}
        showImpossibleModal={showImpossibleModal}
        setShowImpossibleModal={setShowImpossibleModal}
        handleImpossible={handleImpossible}
        showUnmaskModal={showUnmaskModal}
        setShowUnmaskModal={setShowUnmaskModal}
        handleConfirmUnmask={handleConfirmUnmask}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  content: {
    paddingHorizontal: 25,
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
    borderColor: "rgba(255,107,107,0.3)",
    backgroundColor: "rgba(255,107,107,0.05)",
    borderRadius: 8,
  },
  leaveGameButtonDisabled: {
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  leaveGameText: {
    fontSize: 10,
    color: "#FF6B6B",
    letterSpacing: 2,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 107, 107, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  leaveGameTextDisabled: {
    color: "rgba(255,255,255,0.15)",
  },
});
