import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveRouletteOverlay.styles';

interface RouletteStripProps {
  names: string[];
  winnerName: string | null;
}

const RouletteStrip = ({ names, winnerName }: RouletteStripProps) => {
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
  }, [winnerName, names, stripHeight, scrollY]);

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
      </Animated.View>
    </View>
  );
};

interface ActiveRouletteOverlayProps {
  isRouletteActive: boolean;
  agentInIncident: Agent | undefined | null;
  rouletteWinner: string | null;
  agents: Agent[];
}

export function ActiveRouletteOverlay({
  isRouletteActive,
  agentInIncident,
  rouletteWinner,
  agents,
}: ActiveRouletteOverlayProps) {
  const { t } = useTranslation();

  if (!isRouletteActive) return null;

  return (
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
                  agentInIncident?.incident?.unmaskerName || t("common.unknown"),
                  agentInIncident?.name || t("common.unknown"),
                ]}
                winnerName={
                  rouletteWinner
                    ? rouletteWinner === agentInIncident?.id
                      ? agentInIncident.name || ""
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
  );
}
