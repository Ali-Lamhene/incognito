import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { getAgentColor } from '../utils/agentColors';
import { styles } from './ActiveAgentsList.styles';
import { Theme } from '../constants/Theme';


interface ActiveAgentsListProps {
  agents: Agent[];
  profile: any;
  handleUnmask: (targetId: string) => void;
}

export const ActiveAgentsList = React.memo(function ActiveAgentsList({
  agents,
  profile,
  handleUnmask,
}: ActiveAgentsListProps) {
  const { t } = useTranslation();



  const filteredAgents = agents;

  return (
    <View style={styles.sectionContainer}>
      {/* Surveillance des autres agents */}
      <View style={styles.agentsHeader}>
        <ThemedText style={styles.sectionTitle}>
          {`${t("mission.field_units_status")} (${filteredAgents.length})`}
        </ThemedText>
      </View>

      <View style={styles.agentsList}>
        {filteredAgents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {t("mission.no_other_agents")}
            </ThemedText>
          </View>
        ) : (
          filteredAgents.map((agent, index) => {
          const avatarBg = getAgentColor(agent.id, agents);
          const isLast = index === filteredAgents.length - 1;
          return (
            <View
              key={agent.id}
              style={[styles.agentRow, isLast && { borderBottomWidth: 0 }]}
            >
              <View style={styles.agentInfo}>
                <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
                  <FontAwesome5 name="user-secret" size={25} color="#FFFFFF" style={{ transform: [{ translateY: 2.8 }] }} />
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

              {agent.id !== profile?.id && (
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
              )}
            </View>
          );
        })
      )}
      </View>
    </View>
  );
});
