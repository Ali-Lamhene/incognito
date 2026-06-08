import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveAgentsList.styles';

interface ActiveAgentsListProps {
  agents: Agent[];
  profile: any;
  agentInIncident?: Agent | null;
  now: number;
  handleUnmask: (targetId: string) => void;
}

export function ActiveAgentsList({
  agents,
  profile,
  agentInIncident,
  now,
  handleUnmask,
}: ActiveAgentsListProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Surveillance des autres agents */}
      <View style={styles.agentsHeader}>
        <ThemedText type="code" style={styles.sectionTitle}>
          {t("mission.field_units_status")}
        </ThemedText>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <ThemedText type="code" style={styles.liveText}>
            {t('mission.live') || 'LIVE'}
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
    </>
  );
}
