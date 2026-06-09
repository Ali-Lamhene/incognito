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
  now: number;
  handleUnmask: (targetId: string) => void;
}

export function ActiveAgentsList({
  agents,
  profile,
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
              style={styles.agentRow}
            >
              <View style={styles.agentInfo}>
                <View style={styles.agentAvatarPlaceholder}>
                  <ThemedText type="code" style={{ fontSize: 10 }}>
                    {agent.name?.substring(0, 2) || "??"}
                  </ThemedText>
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
                  <ThemedText style={styles.agentStatusText}>
                    {t("mission.operational")}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleUnmask(agent.id)}
                style={styles.unmaskBtn}
              >
                <ThemedText
                  type="code"
                  style={styles.unmaskText}
                >
                  {t("mission.unmask_now")}
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          ))}
      </View>
    </>
  );
}
