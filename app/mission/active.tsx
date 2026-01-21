import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { MissionStartSplashScreen } from "../../components/MissionStartSplashScreen";
import { ThemedText } from "../../components/ThemedText";
import { useSession } from "../../context/SessionContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useProfileStore } from "../../store/profileStore";

const RouletteStrip = ({
  names,
  winnerName,
}: {
  names: string[];
  winnerName: string | null;
}) => {
  const scrollY = useSharedValue(0);
  const stripHeight = names.length * 80;

  useEffect(() => {
    if (!winnerName) {
      scrollY.value = withRepeat(
        withTiming(-stripHeight, { duration: 400 }),
        -1,
        false,
      );
    } else {
      const winnerIdx = names.indexOf(winnerName);
      scrollY.value = withTiming(-winnerIdx * 80, { duration: 800 });
    }
  }, [winnerName]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  return (
    <View style={{ height: 80, overflow: "hidden" }}>
      <Animated.View style={animStyle}>
        {names.map((name, i) => (
          <View
            key={i}
            style={{
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(255, 107, 107, 0.2)",
                width: "100%",
                alignItems: "center",
              }}
            >
              <ThemedText
                type="futuristic"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 20,
                  color: "#FFF",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {name.toUpperCase()}
              </ThemedText>
            </View>
          </View>
        ))}
        {!winnerName &&
          names.map((name, i) => (
            <View
              key={`loop-${i}`}
              style={{
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 107, 107, 0.2)",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ThemedText
                  type="futuristic"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 20,
                    color: "#FFF",
                    letterSpacing: 2,
                    textAlign: "center",
                  }}
                >
                  {name.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          ))}
      </Animated.View>
    </View>
  );
};

export default function ActiveMissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    session,
    agents,
    events,
    status,
    clearSession,
    completeChallenge,
    triggerBluff,
    finalizeChallengePoints,
    reportImpossibleChallenge,
    voteIncident,
    resolveImpossibleChallenge,
    unmaskAgent,
    respondToUnmask,
    resolveUnmaskVote,
    triggerRouletteTirage,
  } = useSession();
  const { profile } = useProfileStore();
  const { t } = useTranslation();

  const [isRevealed, setIsRevealed] = useState(false);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [showImpossibleModal, setShowImpossibleModal] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<string[]>([]);
  const [isRouletteActive, setIsRouletteActive] = useState(false);
  const [rouletteWinner, setRouletteWinner] = useState<string | null>(null);
  const [showUnmaskModal, setShowUnmaskModal] = useState(false);
  const [targetIdToUnmask, setTargetIdToUnmask] = useState<string | null>(null);
  const [processedRouletteIncident, setProcessedRouletteIncident] = useState<
    string | null
  >(null);
  const [now, setNow] = useState(Date.now());
  const [showStartSplash, setShowStartSplash] = useState(true);

  const parseDuration = (d?: string) => {
    if (!d) return 0;
    const match = d.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 * 1000 : 0;
  };

  const durationMs = parseDuration(session?.duration);
  const startTime = session?.startedAt || 0;
  const endTime = startTime + durationMs;
  const timeLeft = Math.max(0, endTime - now);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 60000 && timeLeft > 0;

  const scanPos = useSharedValue(0);

  const me = agents.find((a) => a.id === profile?.id);
  const myChallenge = me?.challenge;
  const isCompleted = me?.completed;
  const isHost = session?.role === "HOST";

  // Agent impliqué dans un incident
  const agentInIncident = agents.find((a) => !!a.incident);
  const incidentType = agentInIncident?.incident?.type;
  const incidentVotes = agentInIncident?.incident?.votes || {};
  const myVote = incidentVotes[profile?.id || ""];

  // Stats pour mission impossible
  const countPossible = Object.values(incidentVotes).filter(
    (v) => v === "IMPOSSIBLE",
  ).length;
  const countFeasible = Object.values(incidentVotes).filter(
    (v) => v === "FEASIBLE",
  ).length;

  // Stats pour démasquage
  const countYes = Object.values(incidentVotes).filter(
    (v) => v === "YES",
  ).length;
  const countNo = Object.values(incidentVotes).filter((v) => v === "NO").length;

  const maxVoters = agents.length - 2;
  const currentVoters = Object.keys(incidentVotes).length;
  const isUnmaskTie =
    incidentType === "UNMASK_VOTE" &&
    countYes === countNo &&
    currentVoters >= maxVoters;

  useEffect(() => {
    if (status === "LOBBY") {
      router.replace("/");
      return;
    }

    scanPos.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
  }, [status]);

  const animatedScanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value * 250 }], // 250 est une approx de la hauteur max
  }));

  // Auto-finalize points when timer expires + UI Tick
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime); // Force UI update

      agents.forEach((agent) => {
        if (agent.pendingValidation) {
          const elapsed = currentTime - agent.pendingValidation.startedAt;
          if (elapsed >= 60000) {
            finalizeChallengePoints(agent.id);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [agents]);

  // Toast management: appear for 5s then disappear
  useEffect(() => {
    const currentTime = Date.now();
    const newEvents = events.filter((e) => {
      const isRecent = currentTime - e.timestamp < 5000;
      const notShowing = !visibleEvents.includes(e.id);
      return isRecent && notShowing;
    });

    if (newEvents.length > 0) {
      const newIds = newEvents.map((e) => e.id);
      setVisibleEvents((prev) => [...prev, ...newIds]);

      newIds.forEach((id) => {
        setTimeout(() => {
          setVisibleEvents((prev) => prev.filter((vid) => vid !== id));
        }, 5000);
      });
    }
  }, [events]);

  const handleComplete = async () => {
    if (profile?.id) {
      await completeChallenge(profile.id);
      setIsRevealed(false); // Re-hide after completion
    }
  };

  const handleBluff = async () => {
    if (profile?.id) {
      await triggerBluff(profile.id);
      setIsRevealed(false);
    }
  };
  const handleAbort = async () => {
    setShowAbortModal(false);
    await clearSession(profile?.id);
    router.replace("/");
  };

  const handleImpossible = async () => {
    setShowImpossibleModal(false);
    if (profile?.id) {
      await reportImpossibleChallenge(profile.id);
    }
  };

  const handleVote = async (vote: "FEASIBLE" | "IMPOSSIBLE" | "YES" | "NO") => {
    if (agentInIncident && profile?.id) {
      await voteIncident(agentInIncident.id, profile.id, vote);
    }
  };

  const handleUnmask = (targetId: string) => {
    setTargetIdToUnmask(targetId);
    setShowUnmaskModal(true);
  };

  const handleConfirmUnmask = async () => {
    if (profile?.id && targetIdToUnmask) {
      await unmaskAgent(targetIdToUnmask, profile.id);
      setShowUnmaskModal(false);
      setTargetIdToUnmask(null);
    }
  };

  const handleRespondToUnmask = async (isCorrect: boolean) => {
    if (agentInIncident && profile?.id) {
      await respondToUnmask(agentInIncident.id, isCorrect);
    }
  };

  const handleResolveUnmaskVote = async (wasActuallyCorrect: boolean) => {
    if (agentInIncident && profile?.id) {
      await resolveUnmaskVote(agentInIncident.id, wasActuallyCorrect);
    }
  };

  const startRoulette = (sharedWinnerId: string) => {
    if (!agentInIncident || isRouletteActive) return;
    setIsRouletteActive(true);
    const unmaskerId = agentInIncident.incident?.unmaskerId;

    // On laisse l'animation tourner 4 secondes
    setTimeout(() => {
      setRouletteWinner(sharedWinnerId);
      // On attend 2s sur le vainqueur avant de valider
      setTimeout(() => {
        // SEUL LE GAGNANT ou L'ACCUSATEUR (si gagnant) résout pour éviter les doublons
        // Ici on décide que c'est celui qui a initié (l'unmasker) qui finit le job si c'est lui qui a déclenché
        // Ou plus simplement: celui qui est localement l'unmasker s'occupe de la résolution Firebase
        const isUnmasker = profile?.id === unmaskerId;
        if (isUnmasker) {
          handleResolveUnmaskVote(sharedWinnerId === unmaskerId);
        }
        setIsRouletteActive(false);
        setRouletteWinner(null);
      }, 2000);
    }, 4000);
  };

  // Auto-trigger roulette logic
  useEffect(() => {
    if (
      incidentType === "UNMASK_VOTE" &&
      (isUnmaskTie || maxVoters <= 0) &&
      agentInIncident
    ) {
      const sharedWinner = agentInIncident.incident?.rouletteWinnerId;
      const isUnmasker = profile?.id === agentInIncident.incident?.unmaskerId;
      const incidentId = `${agentInIncident.id}-${agentInIncident.incident?.reportedAt}`;

      if (sharedWinner) {
        // Si on n'a pas encore traité cet incident précis
        if (
          processedRouletteIncident !== incidentId &&
          !isRouletteActive &&
          !rouletteWinner
        ) {
          setProcessedRouletteIncident(incidentId);
          startRoulette(sharedWinner);
        }
      } else if (isUnmasker) {
        // Personne n'a encore choisi, l'accusateur s'en occupe
        triggerRouletteTirage(
          agentInIncident.id,
          agentInIncident.incident!.unmaskerId!,
        );
      }
    } else if (!agentInIncident) {
      // Reset quand il n'y a plus d'incident
      setProcessedRouletteIncident(null);
    }
  }, [
    incidentType,
    isUnmaskTie,
    maxVoters,
    isRouletteActive,
    rouletteWinner,
    agentInIncident?.incident?.rouletteWinnerId,
    processedRouletteIncident,
  ]);

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
          source={require("../../assets/images/suspect_photo_bg.png")}
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
                {session?.code}
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
              {me?.score || 0}
            </ThemedText>
            <View style={styles.scoreStatusIndicator}>
              <View
                style={[styles.statusDot, { backgroundColor: "#4CAF50" }]}
              />
              <ThemedText type="code" style={styles.statusText}>
                {t("mission.agency_verified")}
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Banner Incident with Universal Voting */}
        {agentInIncident && (
          <Animated.View
            entering={FadeInDown}
            style={[
              styles.incidentBanner,
              agentInIncident.id === profile?.id &&
              styles.incidentBannerSubject,
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.incidentHeader}>
                <Ionicons
                  name={
                    incidentType === "IMPOSSIBLE" ? "warning" : "finger-print"
                  }
                  size={16}
                  color="#FF6B6B"
                />
                <ThemedText type="code" style={styles.incidentTitle}>
                  {incidentType === "IMPOSSIBLE"
                    ? t("mission.anomaly_reported")
                    : t("mission.unmasking_in_progress")}
                </ThemedText>

                {incidentType !== "UNMASK_PROMPT" && (
                  <View style={styles.voterTally}>
                    <ThemedText type="code" style={styles.voterTallyText}>
                      {Object.keys(incidentVotes).length}/
                      {agents.length - (incidentType === "UNMASK_VOTE" ? 2 : 1)}{" "}
                      {t("mission.votes")}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Cas MISSION IMPOSSIBLE */}
              {incidentType === "IMPOSSIBLE" && (
                <>
                  <ThemedText style={styles.incidentText}>
                    {agentInIncident.id === profile?.id
                      ? t("mission.majority_required")
                      : t("mission.claim_impossible").replace(
                        "{{name}}",
                        agentInIncident.name,
                      )}
                  </ThemedText>

                  <View style={styles.reportedChallengeBox}>
                    <ThemedText style={styles.reportedChallengeText}>
                      "{agentInIncident.challenge?.text}"
                    </ThemedText>
                  </View>

                  <View style={styles.universalVoteSection}>
                    <View style={styles.voteBreakdown}>
                      <View
                        style={[
                          styles.voteColumn,
                          countPossible > countFeasible &&
                          styles.voteColumnWinning,
                        ]}
                      >
                        <ThemedText
                          type="code"
                          style={[styles.columnTitle, { color: "#FF6B6B" }]}
                        >
                          {t("mission.impossible")} ({countPossible})
                        </ThemedText>
                        {agents
                          .filter((a) => incidentVotes[a.id] === "IMPOSSIBLE")
                          .map((a) => (
                            <ThemedText key={a.id} style={styles.voterName}>
                              • {a.name}
                            </ThemedText>
                          ))}
                      </View>
                      <View style={styles.breakdownDivider} />
                      <View
                        style={[
                          styles.voteColumn,
                          countFeasible > countPossible &&
                          styles.voteColumnWinning,
                        ]}
                      >
                        <ThemedText
                          type="code"
                          style={[styles.columnTitle, { color: "#4CAF50" }]}
                        >
                          {t("mission.feasible")} ({countFeasible})
                        </ThemedText>
                        {agents
                          .filter((a) => incidentVotes[a.id] === "FEASIBLE")
                          .map((a) => (
                            <ThemedText key={a.id} style={styles.voterName}>
                              • {a.name}
                            </ThemedText>
                          ))}
                      </View>
                    </View>

                    {agentInIncident.id !== profile?.id ? (
                      <View style={styles.voteActions}>
                        <TouchableOpacity
                          onPress={() => handleVote("IMPOSSIBLE")}
                          style={[
                            styles.voteBtn,
                            myVote === "IMPOSSIBLE" &&
                            styles.voteBtnSelectedImpossible,
                          ]}
                        >
                          <Ionicons
                            name="thumbs-up"
                            size={14}
                            color={myVote === "IMPOSSIBLE" ? "#FFF" : "#FF6B6B"}
                          />
                          <ThemedText
                            type="code"
                            style={[
                              styles.voteBtnText,
                              myVote === "IMPOSSIBLE" && { color: "#FFF" },
                            ]}
                          >
                            {t("mission.impossible")}
                          </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleVote("FEASIBLE")}
                          style={[
                            styles.voteBtn,
                            myVote === "FEASIBLE" &&
                            styles.voteBtnSelectedFeasible,
                          ]}
                        >
                          <Ionicons
                            name="thumbs-down"
                            size={14}
                            color={myVote === "FEASIBLE" ? "#FFF" : "#4CAF50"}
                          />
                          <ThemedText
                            type="code"
                            style={[
                              styles.voteBtnText,
                              myVote === "FEASIBLE" && { color: "#FFF" },
                            ]}
                          >
                            {t("mission.feasible")}
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.subjectActionsSection}>
                        {countPossible !== countFeasible &&
                          (countPossible > 0 || countFeasible > 0) ? (
                          <TouchableOpacity
                            onPress={() =>
                              resolveImpossibleChallenge(
                                agentInIncident.id,
                                countPossible > countFeasible,
                              )
                            }
                            style={[
                              styles.applyMajorityBtn,
                              {
                                backgroundColor:
                                  countPossible > countFeasible
                                    ? "#4CAF50"
                                    : "#FF6B6B",
                              },
                            ]}
                          >
                            <ThemedText
                              type="code"
                              style={styles.applyMajorityText}
                            >
                              {countPossible > countFeasible
                                ? t("mission.validate")
                                : t("mission.accept_failure")}
                            </ThemedText>
                          </TouchableOpacity>
                        ) : (
                          <ThemedText style={styles.voterName}>
                            {t("mission.waiting_majority")}
                          </ThemedText>
                        )}
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* Cas UNMASK_PROMPT (Le suspect doit répondre) */}
              {incidentType === "UNMASK_PROMPT" && (
                <>
                  <ThemedText style={styles.incidentText}>
                    {agentInIncident.id === profile?.id
                      ? t("mission.unmask_attempt_self").replace(
                        "{{name}}",
                        agentInIncident.incident?.unmaskerName || "",
                      )
                      : t("mission.unmask_attempt_other")
                        .replace(
                          "{{unmasker}}",
                          agentInIncident.incident?.unmaskerName || "",
                        )
                        .replace("{{target}}", agentInIncident.name || "")}
                  </ThemedText>

                  {agentInIncident.id === profile?.id ? (
                    <View style={styles.voteActions}>
                      <TouchableOpacity
                        onPress={() => handleRespondToUnmask(true)}
                        style={[
                          styles.voteBtn,
                          styles.voteBtnSelectedFeasible,
                          { paddingVertical: 14 },
                        ]}
                      >
                        <ThemedText type="code" style={{ color: "#FFF" }}>
                          {t("mission.unmask_confess")}
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRespondToUnmask(false)}
                        style={[
                          styles.voteBtn,
                          styles.voteBtnSelectedImpossible,
                          { paddingVertical: 14 },
                        ]}
                      >
                        <ThemedText type="code" style={{ color: "#FFF" }}>
                          {t("mission.unmask_deny")}
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.subjectWaitBoxCompact}>
                      <ThemedText style={styles.voterName}>
                        {t("mission.waiting_response_from").replace(
                          "{{name}}",
                          agentInIncident.name || "",
                        )}
                      </ThemedText>
                    </View>
                  )}
                </>
              )}

              {/* Cas UNMASK_VOTE (L'assemblée juge car le suspect a nié) */}
              {incidentType === "UNMASK_VOTE" && (
                <>
                  <ThemedText style={styles.incidentText}>
                    {t("mission.deny_unmask_msg").replace(
                      "{{name}}",
                      agentInIncident.name || "",
                    )}
                  </ThemedText>

                  <View
                    style={[
                      styles.reportedChallengeBox,
                      { borderColor: "#A29BFE" },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.reportedChallengeText,
                        { color: "#A29BFE" },
                      ]}
                    >
                      "{agentInIncident.challenge?.text}"
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.incidentText}>
                    {t("mission.was_he_right").replace(
                      "{{unmasker}}",
                      agentInIncident.incident?.unmaskerName || "",
                    )}
                  </ThemedText>

                  <View style={styles.universalVoteSection}>
                    <View style={styles.voteBreakdown}>
                      <View
                        style={[
                          styles.voteColumn,
                          countYes > countNo && styles.voteColumnWinning,
                        ]}
                      >
                        <ThemedText
                          type="code"
                          style={[styles.columnTitle, { color: "#4CAF50" }]}
                        >
                          {t("mission.yes")} ({countYes})
                        </ThemedText>
                        {agents
                          .filter((a) => incidentVotes[a.id] === "YES")
                          .map((a) => (
                            <ThemedText key={a.id} style={styles.voterName}>
                              • {a.name}
                            </ThemedText>
                          ))}
                      </View>
                      <View
                        style={[
                          styles.voteColumn,
                          countNo > countYes && styles.voteColumnWinning,
                        ]}
                      >
                        <ThemedText
                          type="code"
                          style={[styles.columnTitle, { color: "#FF6B6B" }]}
                        >
                          {t("mission.no")} ({countNo})
                        </ThemedText>
                        {agents
                          .filter((a) => incidentVotes[a.id] === "NO")
                          .map((a) => (
                            <ThemedText key={a.id} style={styles.voterName}>
                              • {a.name}
                            </ThemedText>
                          ))}
                      </View>
                    </View>

                    {profile?.id !== agentInIncident.id &&
                      profile?.id !== agentInIncident.incident?.unmaskerId ? (
                      <View style={styles.voteActions}>
                        <TouchableOpacity
                          onPress={() => handleVote("YES")}
                          style={[
                            styles.voteBtn,
                            myVote === "YES" && styles.voteBtnSelectedFeasible,
                          ]}
                        >
                          <ThemedText
                            type="code"
                            style={[
                              styles.voteBtnText,
                              myVote === "YES" && { color: "#FFF" },
                            ]}
                          >
                            {t("mission.he_is_right")}
                          </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleVote("NO")}
                          style={[
                            styles.voteBtn,
                            myVote === "NO" && styles.voteBtnSelectedImpossible,
                          ]}
                        >
                          <ThemedText
                            type="code"
                            style={[
                              styles.voteBtnText,
                              myVote === "NO" && { color: "#FFF" },
                            ]}
                          >
                            {t("mission.he_is_wrong")}
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.subjectActionsSection}>
                        {isRouletteActive ? (
                          <View
                            style={[
                              styles.applyMajorityBtn,
                              {
                                backgroundColor: "rgba(255, 107, 107, 0.2)",
                                borderColor: "#FF6B6B",
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <Ionicons name="sync" size={18} color="#FF6B6B" />
                            <View>
                              <ThemedText
                                type="code"
                                style={[
                                  styles.applyMajorityText,
                                  { color: "#FF6B6B" },
                                ]}
                              >
                                {t("mission.arbitration_in_progress")}
                              </ThemedText>
                              <ThemedText style={styles.applyMajoritySub}>
                                {t("mission.random_selection_msg")}
                              </ThemedText>
                            </View>
                          </View>
                        ) : countYes !== countNo &&
                          (countYes > 0 || countNo > 0) ? (
                          <TouchableOpacity
                            onPress={() =>
                              handleResolveUnmaskVote(countYes > countNo)
                            }
                            style={[
                              styles.applyMajorityBtn,
                              {
                                backgroundColor:
                                  countYes > countNo ? "#4CAF50" : "#FF6B6B",
                              },
                            ]}
                          >
                            <ThemedText
                              type="code"
                              style={styles.applyMajorityText}
                            >
                              {countYes > countNo
                                ? t("mission.validate_unmasking")
                                : t("mission.wrong_accusation")}
                            </ThemedText>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.subjectWaitBoxCompact}>
                            <ThemedText style={styles.voterName}>
                              {maxVoters <= 0
                                ? t("mission.init_arbitration")
                                : t("mission.waiting_votes")}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {/* Tactical Challenge Card */}
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
                  ? t("mission.verification_success")
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

        {/* Surveillance des autres agents */}
        <View style={styles.agentsHeader}>
          <ThemedText type="code" style={styles.sectionTitle}>
            {t("mission.field_units_status")}
          </ThemedText>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <ThemedText type="code" style={styles.liveText}>
              LIVE
            </ThemedText>
          </View>
        </View>

        <View style={styles.agentsList}>
          {agents
            .filter((a) => a.id !== profile?.id)
            .map((agent, index) => (
              <Animated.View
                key={agent.id}
                entering={FadeInUp.delay(400 + index * 100)}
                style={[
                  styles.agentRow,
                  agent.completed && styles.agentRowCompleted,
                  agent.incident && styles.agentRowIncident,
                ]}
              >
                <View style={styles.agentInfo}>
                  <View
                    style={[
                      styles.agentAvatarPlaceholder,
                      agent.completed && styles.avatarCompleted,
                      agent.incident && styles.avatarIncident,
                    ]}
                  >
                    {agent.completed ? (
                      <Ionicons name="checkmark" size={16} color="#4CAF50" />
                    ) : agent.incident ? (
                      <Ionicons name="hammer" size={16} color="#FF6B6B" />
                    ) : (
                      <ThemedText type="code" style={{ fontSize: 10 }}>
                        {agent.name?.substring(0, 2) || "??"}
                      </ThemedText>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ThemedText
                        type="code"
                        style={styles.agentName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {agent.name}
                      </ThemedText>
                      <View style={styles.agentScoreBadge}>
                        <ThemedText type="code" style={styles.agentScoreText}>
                          {agent.score || 0}
                        </ThemedText>
                      </View>
                    </View>
                    {agent.pendingValidation ? (
                      <View style={styles.criticalStatus}>
                        <ThemedText
                          style={[styles.agentStatusText, { color: "#FFD93D" }]}
                        >
                          {t("mission.suspicious_transmission").replace(
                            "{{time}}",
                            Math.max(
                              0,
                              Math.floor(
                                (60000 -
                                  (now - agent.pendingValidation.startedAt)) /
                                1000,
                              ),
                            ).toString(),
                          )}
                        </ThemedText>
                        <View style={styles.alertPulse} />
                      </View>
                    ) : (
                      <ThemedText style={styles.agentStatusText}>
                        {t("mission.operational")}
                      </ThemedText>
                    )}
                  </View>
                </View>

                {!agent.incident && (
                  <TouchableOpacity
                    onPress={() => handleUnmask(agent.id)}
                    disabled={!!agentInIncident}
                    style={[
                      styles.unmaskBtn,
                      !!agentInIncident && styles.unmaskBtnDisabled,
                      agent.pendingValidation && styles.unmaskBtnActive,
                    ]}
                  >
                    <ThemedText
                      type="code"
                      style={[
                        styles.unmaskText,
                        !!agentInIncident && styles.unmaskTextDisabled,
                        agent.pendingValidation && styles.unmaskTextActive,
                      ]}
                    >
                      {!!agentInIncident
                        ? t("mission.voting_in_progress")
                        : agent.pendingValidation
                          ? t("mission.unmask_now_excl")
                          : t("mission.unmask_now")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
        </View>

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

      {/* Roulette de Tirage au Sort (Modal UI) - FIXED OVERLAY */}
      {isRouletteActive && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.rouletteOverlay,
            { backgroundColor: "rgba(0,0,0,0.95)" },
          ]}
        >
          <View style={styles.rouletteContainer}>
            <View style={styles.rouletteHeader}>
              <Ionicons name="flash" size={30} color="#FF6B6B" />
              <ThemedText type="futuristic" style={styles.rouletteTitle}>
                {t("mission.random_arbitration")}
              </ThemedText>
              <ThemedText style={styles.rouletteSub}>
                {t("mission.tie_break_msg")}
              </ThemedText>
            </View>

            <View style={styles.rouletteBox}>
              <View style={styles.rouletteMarker} />
              <View style={{ width: "100%", alignItems: "center" }}>
                <View style={{ width: "100%" }}>
                  <RouletteStrip
                    names={[
                      agentInIncident?.incident?.unmaskerName ||
                      t("common.unknown"),
                      agentInIncident?.name || t("common.unknown"),
                    ]}
                    winnerName={
                      rouletteWinner
                        ? rouletteWinner === agentInIncident?.id
                          ? agentInIncident.name
                          : agentInIncident?.incident?.unmaskerName || ""
                        : null
                    }
                  />
                </View>
              </View>
            </View>

            {rouletteWinner && (
              <Animated.View entering={FadeInUp} style={styles.winnerTag}>
                <ThemedText type="futuristic" style={styles.winnerName}>
                  {t("mission.verdict").replace(
                    "{{name}}",
                    agents.find((a) => a.id === rouletteWinner)?.name || "",
                  )}
                </ThemedText>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Flux Tactique des Événements (Bottom Left Toast) */}
      <View
        style={[styles.eventFeed, { bottom: insets.bottom + 20 }]}
        pointerEvents="none"
      >
        {events
          .filter((e) => visibleEvents.includes(e.id))
          .map((event, idx) => (
            <Animated.View
              key={event.id}
              entering={FadeInLeft.duration(400)}
              exiting={FadeOut.duration(300)}
              style={[styles.eventToast, styles[`eventToast_${event.type}`]]}
            >
              <View style={styles.eventIconBox}>
                <Ionicons
                  name={
                    event.type === "SUSPECT"
                      ? "eye"
                      : event.type === "SUCCESS"
                        ? "checkmark-circle"
                        : event.type === "UNMASKED"
                          ? "shield-outline"
                          : "alert-circle"
                  }
                  size={14}
                  color="#FFF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="code" style={styles.eventLabel}>
                  {event.type === "SUSPECT"
                    ? t("mission.event_suspect")
                    : event.type === "SUCCESS"
                      ? t("mission.event_success")
                      : event.type === "UNMASKED"
                        ? t("mission.event_unmasked")
                        : event.type === "BLUFF_SUCCESS"
                          ? t("mission.event_bluff")
                          : t("mission.event_error")}
                </ThemedText>
                <ThemedText style={styles.eventText} numberOfLines={2}>
                  {event.type === "SUSPECT"
                    ? t("mission.event_suspect_msg").replace(
                      "{{name}}",
                      event.agentName || "",
                    )
                    : event.type === "SUCCESS"
                      ? t("mission.event_success_msg")
                        .replace("{{name}}", event.agentName || "")
                        .replace(
                          "{{points}}",
                          event.points?.toString() || "0",
                        )
                      : event.type === "UNMASKED"
                        ? t("mission.event_unmasked_msg")
                          .replace("{{unmasker}}", event.targetName || "")
                          .replace("{{agent}}", event.agentName || "")
                          .replace("{{mission}}", event.missionText || "")
                        : event.type === "BLUFF_SUCCESS"
                          ? t("mission.event_bluff_msg")
                            .replace("{{name}}", event.agentName || "")
                            .replace("{{target}}", event.targetName || "")
                            .replace(
                              "{{points}}",
                              event.points?.toString() || "0",
                            )
                          : t("mission.event_error_msg")
                            .replace("{{name}}", event.agentName || "")
                            .replace("{{target}}", event.targetName || "")
                            .replace(
                              "{{points}}",
                              event.points?.toString() || "0",
                            )}
                </ThemedText>
              </View>
            </Animated.View>
          ))}
      </View>

      <ConfirmationModal
        visible={showAbortModal}
        title={t("mission.abort_title")}
        message={t("mission.abort_msg")}
        confirmLabel={t("mission.btn_leave_mission")}
        cancelLabel={t("mission.btn_stay")}
        variant="danger"
        onConfirm={handleAbort}
        onCancel={() => setShowAbortModal(false)}
      />

      <ConfirmationModal
        visible={showImpossibleModal}
        title={t("mission.impossible_title")}
        message={t("mission.impossible_msg")}
        confirmLabel={t("mission.btn_new_objective")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleImpossible}
        onCancel={() => setShowImpossibleModal(false)}
      />

      <ConfirmationModal
        visible={showUnmaskModal}
        title={t("mission.unmask_popup_title")}
        message={t("mission.unmask_popup_msg")}
        confirmLabel={t("mission.unmask_popup_btn")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmUnmask}
        onCancel={() => setShowUnmaskModal(false)}
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
  missionCode: {
    fontSize: 24,
    color: "#FFF",
  },
  abortButton: {
    padding: 10,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 50,
  },
  cardContainer: {
    marginBottom: 40,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  terminalHeader: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  terminalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  terminalTitle: {
    fontSize: 9,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
  },
  clearanceBadge: {
    marginLeft: "auto",
    backgroundColor: "rgba(255,107,107,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  clearanceText: {
    fontSize: 7,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  blurCard: {
    padding: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: "relative",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "bold",
  },
  challengeBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 25,
    height: 220, // Increased height for better readability
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  challengeBoxHidden: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.2)",
  },
  challengeBoxCompleted: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
  },
  hiddenContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  lockIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  revealText: {
    fontSize: 14,
    color: "#FFF",
    letterSpacing: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  revealSubtext: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 1,
  },
  challengeContent: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  quoteMarkTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 15,
    height: 15,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  quoteMarkBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  errorSubtext: {
    fontSize: 10,
    color: "#FF6B6B",
    opacity: 0.8,
    fontStyle: "italic",
    marginTop: 15,
    textAlign: "center",
  },
  challengeText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  challengeTextCompleted: {
    color: "#4CAF50",
    opacity: 0.9,
  },
  tacticalCompleteBtn: {
    height: 60,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    borderRadius: 4,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tacticalCompleteText: {
    fontSize: 14,
    color: "#4CAF50",
    letterSpacing: 2,
  },
  btnCornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#4CAF50",
  },
  btnCornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#4CAF50",
  },
  completedBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  completedBadgeText: {
    fontSize: 11,
    color: "#4CAF50",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  cornerL_TL: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cornerL_TR: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cornerL_BL: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cornerL_BR: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  agentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
  },
  liveText: {
    fontSize: 8,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 10,
    opacity: 0.5,
    letterSpacing: 1.5,
  },
  agentsList: {
    gap: 12,
  },
  agentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  agentRowCompleted: {
    borderColor: "rgba(76, 175, 80, 0.2)",
    backgroundColor: "rgba(76, 175, 80, 0.02)",
  },
  agentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 10,
  },
  agentAvatarPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarCompleted: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  agentName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  agentStatusText: {
    fontSize: 8,
    color: "#4CAF50",
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 2,
  },
  unmaskBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
    backgroundColor: "rgba(255,107,107,0.05)",
  },
  unmaskBtnDisabled: {
    borderColor: "rgba(255,255,255,0.05)",
    opacity: 0.5,
  },
  unmaskText: {
    fontSize: 9,
    color: "#FF6B6B",
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(255, 107, 107, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  unmaskTextDisabled: {
    color: "rgba(255,255,255,0.3)",
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
  incidentBanner: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  incidentBannerHost: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  incidentBannerSubject: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderColor: "rgba(255,107,107,0.2)",
  },
  majorityBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginHorizontal: 10,
    opacity: 0.4,
  },
  majorityBadgeActive: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    opacity: 1,
  },
  majorityBadgeText: {
    fontSize: 7,
    color: "#FFF",
    fontWeight: "bold",
  },
  voterTally: {
    marginLeft: "auto",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  voterTallyText: {
    fontSize: 7,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "bold",
  },
  hostVerdictSection: {
    marginTop: 5,
  },
  voteBreakdown: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  voteColumn: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  voteColumnWinning: {
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  columnTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 6,
  },
  voterName: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  voterNameEmpty: {
    fontSize: 9,
    color: "rgba(255,255,255,0.15)",
    fontStyle: "italic",
  },
  applyMajorityBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyMajorityText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "900",
    letterSpacing: 1,
  },
  applyMajoritySub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
  },
  tieText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 15,
  },
  actionDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 15,
  },
  hostDirectActions: {
    flexDirection: "row",
    gap: 10,
  },
  finalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  finalBtnRecommended: {
    borderColor: "#FFF",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  finalBtnText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  subjectWaitBox: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 8,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B6B",
  },
  incidentTitle: {
    fontSize: 10,
    color: "#FF6B6B",
    fontWeight: "700",
    letterSpacing: 2,
  },
  incidentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  incidentText: {
    fontSize: 11,
    color: "#FFF",
    opacity: 0.8,
    lineHeight: 16,
    marginBottom: 10,
  },
  reportedChallengeBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#FF6B6B",
    marginBottom: 15,
  },
  reportedChallengeText: {
    fontSize: 13,
    color: "#FFF",
    fontStyle: "italic",
    fontWeight: "600",
  },
  voteInstruction: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
    fontWeight: "bold",
  },
  voteColumnSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderWidth: 1.5,
  },
  universalVoteSection: {
    marginTop: 10,
  },
  breakdownDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    height: "80%",
    alignSelf: "center",
  },
  subjectActionsSection: {
    marginTop: 15,
    alignItems: "center",
  },
  subjectWaitBoxCompact: {
    paddingVertical: 10,
    opacity: 0.5,
  },
  hostFinalControl: {
    marginTop: 15,
  },
  hostActionBtn: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  hostActionBtnText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
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
    filter: "blur(20px)",
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
  agentScoreBadge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  agentScoreText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "bold",
  },
  voterScore: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.3)",
    fontWeight: "normal",
  },
  voteActions: {
    flexDirection: "row",
    gap: 10,
  },
  voteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  voteBtnSelectedImpossible: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  voteBtnSelectedFeasible: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  voteBtnText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timerBadgeTerminal: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timerBadgeTerminalLow: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderColor: "rgba(255, 107, 107, 0.2)",
    borderWidth: 1,
  },
  timerValueTerminal: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "monospace",
  },
  impossibleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "rgba(255,107,107,0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
    borderStyle: "dashed",
  },
  impossibleBtnText: {
    fontSize: 8.5,
    color: "rgba(255,107,107,0.6)",
    letterSpacing: 0.3,
    fontWeight: "bold",
  },
  challengeBoxIncident: {
    borderColor: "#FF6B6B",
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 107, 107, 0.05)",
  },
  incidentStatus: {
    marginTop: 15,
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  incidentStatusText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  agentRowIncident: {
    borderColor: "rgba(255, 107, 107, 0.3)",
    backgroundColor: "rgba(255, 107, 107, 0.05)",
  },
  avatarIncident: {
    borderColor: "#FF6B6B",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  hostResolveActions: {
    flexDirection: "row",
    gap: 8,
  },
  resolveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  hideHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    opacity: 0.6,
  },
  hideHintText: {
    fontSize: 7,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  pendingBadge: {
    marginTop: 20,
    backgroundColor: "rgba(255, 217, 61, 0.1)",
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 217, 61, 0.3)",
    flexDirection: "row",
    alignItems: "center",
  },
  pendingBadgeBluff: {
    backgroundColor: "rgba(255, 217, 61, 0.1)",
    borderColor: "rgba(255, 217, 61, 0.3)",
  },
  rouletteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
    elevation: 100,
  },
  rouletteContainer: {
    width: "100%",
    maxWidth: 1100,
    marginHorizontal: "auto",
    alignItems: "center",
    padding: 30,
    marginTop: -50,
  },
  rouletteHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  rouletteTitle: {
    fontSize: 18,
    color: "#FF6B6B",
    marginTop: 15,
    letterSpacing: 4,
    textAlign: "center",
    textShadowColor: "rgba(255, 107, 107, 0.5)",
    textShadowRadius: 10,
  },
  rouletteSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
  rouletteBox: {
    width: "95%",
    height: 140,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 107, 0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  rouletteMarker: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 35,
    height: 70,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FF6B6B",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    zIndex: 1,
  },
  rouletteNames: {
    width: "100%",
    zIndex: 2,
  },
  winnerTag: {
    marginTop: 50,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  winnerName: {
    fontSize: 14,
    color: "#FFF",
    letterSpacing: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  pendingBadgeText: {
    fontSize: 11,
    color: "#FFD93D",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  pendingBadgeSub: {
    fontSize: 8,
    color: "rgba(255, 217, 61, 0.7)",
    marginTop: 2,
  },
  unmaskBtnActive: {
    backgroundColor: "rgba(255, 217, 61, 0.15)",
    borderColor: "#FFD93D",
    borderWidth: 2,
  },
  unmaskTextActive: {
    color: "#FFD93D",
    textShadowColor: "rgba(255, 217, 61, 0.5)",
    textShadowRadius: 10,
  },
  criticalStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  alertPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFD93D",
  },
  bluffBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 217, 61, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 217, 61, 0.2)",
    borderStyle: "dashed",
  },
  bluffBtnText: {
    fontSize: 9,
    color: "#FFD93D",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  eventFeed: {
    position: "absolute",
    left: 20,
    width: "75%",
    gap: 8,
    zIndex: 100,
  },
  eventToast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  eventToast_SUSPECT: {
    borderColor: "rgba(255, 217, 61, 0.3)",
  },
  eventToast_SUCCESS: {
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  eventToast_UNMASKED: {
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  eventToast_BLUFF_SUCCESS: {
    borderColor: "rgba(255, 217, 61, 0.3)",
  },
  eventToast_FAILED_UNMASK: {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  eventIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.5)",
  },
  eventText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "500",
  },
});
