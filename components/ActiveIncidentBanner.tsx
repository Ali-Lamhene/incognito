import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveIncidentBanner.styles';

interface ActiveIncidentBannerProps {
  agentInIncident: Agent;
  incidentType: string | undefined | null;
  incidentVotes: Record<string, string>;
  agents: Agent[];
  profile: any; // User profile
  countPossible: number;
  countFeasible: number;
  countYes: number;
  countNo: number;
  myVote: string | null;
  isRouletteActive: boolean;
  maxVoters: number;
  handleVote: (vote: any) => void;
  handleRespondToUnmask: (confess: boolean) => void;
  resolveImpossibleChallenge: (targetId: string, isImpossible: boolean) => void;
  handleResolveUnmaskVote: (isUnmasked: boolean) => void;
}

export function ActiveIncidentBanner({
  agentInIncident,
  incidentType,
  incidentVotes,
  agents,
  profile,
  countPossible,
  countFeasible,
  countYes,
  countNo,
  myVote,
  isRouletteActive,
  maxVoters,
  handleVote,
  handleRespondToUnmask,
  resolveImpossibleChallenge,
  handleResolveUnmaskVote,
}: ActiveIncidentBannerProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown}
      style={[
        styles.incidentBanner,
        agentInIncident.id === profile?.id && styles.incidentBannerSubject,
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.incidentHeader}>
          <Ionicons
            name={incidentType === "IMPOSSIBLE" ? "warning" : "finger-print"}
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
                  agentInIncident.name || "",
                )}
            </ThemedText>

            <View style={styles.reportedChallengeBox}>
              <ThemedText style={styles.reportedChallengeText}>
                {"\""}{agentInIncident.challenge?.text}{"\""}
              </ThemedText>
            </View>

            <View style={styles.universalVoteSection}>
              <View style={styles.voteBreakdown}>
                <View
                  style={[
                    styles.voteColumn,
                    countPossible > countFeasible && styles.voteColumnWinning,
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
                    countFeasible > countPossible && styles.voteColumnWinning,
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
                      myVote === "IMPOSSIBLE" && styles.voteBtnSelectedImpossible,
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
                      myVote === "FEASIBLE" && styles.voteBtnSelectedFeasible,
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
                            countPossible > countFeasible ? "#4CAF50" : "#FF6B6B",
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

            <View style={[styles.reportedChallengeBox, { borderColor: "#A29BFE" }]}>
              <ThemedText style={[styles.reportedChallengeText, { color: "#A29BFE" }]}>
                {"\""}{agentInIncident.challenge?.text}{"\""}
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
                          style={[styles.applyMajorityText, { color: "#FF6B6B" }]}
                        >
                          {t("mission.arbitration_in_progress")}
                        </ThemedText>
                        <ThemedText style={styles.applyMajoritySub}>
                          {t("mission.random_selection_msg")}
                        </ThemedText>
                      </View>
                    </View>
                  ) : countYes !== countNo && (countYes > 0 || countNo > 0) ? (
                    <TouchableOpacity
                      onPress={() => handleResolveUnmaskVote(countYes > countNo)}
                      style={[
                        styles.applyMajorityBtn,
                        {
                          backgroundColor: countYes > countNo ? "#4CAF50" : "#FF6B6B",
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
  );
}
