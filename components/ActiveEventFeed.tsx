import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInLeft, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './ActiveEventFeed.styles';

export interface GameEvent {
  id: string;
  type: string;
  agentName?: string;
  targetName?: string;
  missionText?: string;
  points?: number;
}

interface ActiveEventFeedProps {
  events: GameEvent[];
  visibleEvents: string[];
  bottomInset: number;
}

export function ActiveEventFeed({
  events,
  visibleEvents,
  bottomInset,
}: ActiveEventFeedProps) {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.eventFeed, { bottom: bottomInset }]}
      pointerEvents="none"
    >
      {events
        .filter((e) => visibleEvents.includes(e.id))
        .map((event) => {
          let label = event.type;
          let text = "";

          switch (event.type) {
            case "SUSPECT":
              label = t("mission.event_suspect");
              text = t("mission.event_suspect_msg").replace(
                "{{name}}",
                event.agentName || "",
              );
              break;
            case "SUCCESS":
              label = t("mission.event_success");
              text = t("mission.event_success_msg")
                .replace("{{name}}", event.agentName || "")
                .replace("{{mission}}", event.missionText || "")
                .replace("{{points}}", event.points?.toString() || "0");
              break;
            case "UNMASKED":
              label = t("mission.event_unmasked");
              text = t("mission.event_unmasked_msg")
                .replace("{{unmasker}}", event.targetName || "")
                .replace("{{agent}}", event.agentName || "")
                .replace("{{mission}}", event.missionText || "");
              break;
            case "BLUFF_SUCCESS":
              label = t("mission.event_bluff");
              text = t("mission.event_bluff_msg")
                .replace("{{name}}", event.agentName || "")
                .replace("{{target}}", event.targetName || "")
                .replace("{{points}}", event.points?.toString() || "0");
              break;
            default:
              label = t("mission.event_error");
              text = t("mission.event_error_msg")
                .replace("{{name}}", event.agentName || "")
                .replace("{{target}}", event.targetName || "")
                .replace("{{points}}", event.points?.toString() || "0");
              break;
          }

          return (
            <Animated.View
              key={event.id}
              entering={FadeInLeft.duration(400)}
              exiting={FadeOut.duration(300)}
              style={[
                styles.eventToast,
                (styles as any)[`eventToast_${event.type}`] || styles.eventToast,
              ]}
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
                  {label}
                </ThemedText>
                <ThemedText style={styles.eventText} numberOfLines={2}>
                  {text}
                </ThemedText>
              </View>
            </Animated.View>
          );
        })}
    </View>
  );
}
