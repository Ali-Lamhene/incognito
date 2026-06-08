import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { ThemedText } from './ThemedText';

interface AgentHeaderProps {
  profile: {
    codename: string;
    avatar: string;
    themeColor: string;
  } | null;
  onProfilePress: () => void;
  onSettingsPress: () => void;
  onRulesPress: () => void;
}

export function AgentHeader({
  profile,
  onProfilePress,
  onSettingsPress,
  onRulesPress
}: AgentHeaderProps) {
  const { t } = useTranslation();
  const rulesPulse = useSharedValue(1);

  useEffect(() => {
    // Pulse animation for rules button
    rulesPulse.value = withRepeat(
      withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [rulesPulse]);

  const rulesPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rulesPulse.value }],
    opacity: 0.8 + (rulesPulse.value - 1) * 2,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.header}>
      <TouchableOpacity onPress={onProfilePress} style={styles.logoGroup}>
        <View style={[styles.headerLogoRing, { borderColor: '#FFF' }]}>
          {profile?.avatar ? (
            <Ionicons name={profile.avatar as any} size={20} color="#FFF" />
          ) : (
            <Image
              source={require('../assets/images/icon_logo.png')}
              style={styles.headerLogo}
              contentFit="contain"
            />
          )}
        </View>
        <View style={styles.agentInfo}>
          <ThemedText type="code" style={styles.headerLabel}>{t('home.agent_active')}</ThemedText>
          <ThemedText type="futuristic" style={[styles.agentName, { color: '#FFF' }]}>
            {profile?.codename ? `#${profile.codename}` : t('common.unknown')}
          </ThemedText>
        </View>
      </TouchableOpacity>

      <View style={styles.telemetryGroup}>
        <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
          <Ionicons name="options" size={20} color="#FFF" style={{ opacity: 0.8 }} />
        </TouchableOpacity>
        <View style={styles.separatorV} />
        <Animated.View style={rulesPulseStyle}>
          <TouchableOpacity onPress={onRulesPress} style={styles.signalBadge}>
            <View style={[styles.pulseDot, { backgroundColor: '#FFF' }]} />
            <ThemedText type="code" style={{ color: '#FFF', fontSize: 8 }}>{t('home.rules')}</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLogoRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  agentInfo: {
    gap: 0,
  },
  headerLabel: {
    fontSize: 8,
    opacity: 0.4,
  },
  agentName: {
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 1,
  },
  telemetryGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsButton: {
    padding: 5,
  },
  separatorV: {
    width: 1,
    height: 12,
    backgroundColor: '#FFF',
    opacity: 0.2,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pulseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
