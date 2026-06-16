import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { Theme } from '../constants/Theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface ActiveHeaderProps {
  code?: string;
  agentName?: string;
}

export function ActiveHeader({ code, agentName }: ActiveHeaderProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={styles.container}
    >
      {/* Col 1: Mission */}
      <View style={[styles.column, { flex: 1.8 }]}>
        <Text style={styles.label}>
          {t("mission.mission")}
        </Text>
        <View style={styles.valueRow}>
          <Text 
            style={styles.missionCode}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {code?.toUpperCase() || "SNOW-FALKE-23"}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Col 2: Agent */}
      <View style={[styles.column, { flex: 1.1 }]}>
        <Text style={styles.label}>
          {t("mission.agent")}
        </Text>
        <View style={styles.valueRow}>
          <Text 
            style={styles.agentName}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {agentName?.toUpperCase() || "ALPHA"}
          </Text>
          <FontAwesome5 name="user-secret" size={14} color={Theme.colors.red} style={styles.icon} />
        </View>
      </View>

      <View style={styles.separator} />

      {/* Col 3: Statut */}
      <View style={[styles.column, { flex: 1 }]}>
        <Text style={styles.label}>
          {t("mission.status")}
        </Text>
        <View style={styles.valueRow}>
          <Text 
            style={styles.statusText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t("mission.in_mission")}
          </Text>
          <View style={styles.statusDot} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    backgroundColor: Theme.colors.surface,
    paddingVertical: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
  },
  separator: {
    width: 1,
    height: '70%',
    backgroundColor: Theme.colors.border,
  },
  label: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 7,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: 0,
    fontWeight: 'bold',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24, // Fixes height so labels above are perfectly aligned
  },
  missionCode: {
    fontFamily: Theme.fonts.title,
    fontSize: 16,
    color: Theme.colors.red,
    textAlign: 'center',
  },
  agentName: {
    fontFamily: Theme.fonts.title,
    fontSize: 16,
    color: Theme.colors.text.light,
  },
  icon: {
    marginLeft: 6,
  },
  statusText: {
    fontFamily: Theme.fonts.title,
    fontSize: 12,
    color: Theme.colors.red,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.status.online,
    marginLeft: 6,
    shadowColor: Theme.colors.status.online,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
