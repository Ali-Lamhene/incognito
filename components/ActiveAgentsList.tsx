import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveAgentsList.styles';
import { Theme } from '../constants/Theme';

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

  const avatarColors = [
    '#4F2B79', '#1E3E62', '#8B5E1E', '#1C4A28', // Mockup colors: Purple, Blue, Orange, Green
    '#6B2D2D', '#2D4A6B', '#3B5B3B', '#6B522D', '#4A2D6B',
    '#2D6B5B', '#6B402D', '#454552', '#54384A', '#3D4A3D',
    '#5A4D3D', '#2C3E50', '#4E342E', '#37474F', '#424242',
  ];

  const filteredAgents = agents.filter((a) => a.id !== profile?.id);

  return (
    <View style={styles.sectionContainer}>
      {/* Surveillance des autres agents */}
      <View style={styles.agentsHeader}>
        <ThemedText style={styles.sectionTitle}>
          {`${t("mission.field_units_status")} (${filteredAgents.length})`}
        </ThemedText>
      </View>

      <View style={styles.agentsList}>
        {filteredAgents.map((agent, index) => {
          const avatarBg = avatarColors[index % avatarColors.length];
          const isLast = index === filteredAgents.length - 1;
          return (
            <Animated.View
              key={agent.id}
              entering={FadeInUp.delay(400 + index * 100)}
              style={[styles.agentRow, isLast && { borderBottomWidth: 0 }]}
            >
              <View style={styles.agentInfo}>
                <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
                  <FontAwesome5 name="user-secret" size={20} color="#000000" />
                </View>
                <View style={styles.agentTextContainer}>
                  <ThemedText
                    style={styles.agentName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {agent.name.toUpperCase()}
                  </ThemedText>
                  <View style={styles.agentMetaRow}>
                    <View style={styles.statusWrapper}>
                      <ThemedText style={styles.statusText}>
                        {t("home.status_online") || "EN LIGNE"}
                      </ThemedText>
                      <View style={styles.statusDot} />
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleUnmask(agent.id)}
                style={styles.unmaskBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="locate-outline" size={14} color={Theme.colors.red} />
                <ThemedText
                  type="code"
                  style={styles.unmaskText}
                >
                  {t("mission.unmask_now").toUpperCase()}
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
