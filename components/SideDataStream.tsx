import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

export function SideDataStream() {
  const dataScrollY = useSharedValue(0);

  useEffect(() => {
    dataScrollY.value = withRepeat(
      withTiming(-200, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, [dataScrollY]);

  const animatedDataStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dataScrollY.value }],
  }));

  // Pre-generate static telemetry lines to prevent flickering and optimize performance
  const driftLines = useMemo(() => {
    return Array.from({ length: 25 }).map(() => {
      const hex = Math.random().toString(16).slice(2, 8).toUpperCase();
      return `>> ${hex} // OK`;
    });
  }, []);

  return (
    <View style={styles.sideDataOverlay} pointerEvents="none">
      <Animated.View style={animatedDataStyle}>
        {driftLines.map((line, i) => (
          <ThemedText key={i} type="code" style={styles.driftText}>
            {line}
          </ThemedText>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sideDataOverlay: {
    position: 'absolute',
    right: 10,
    top: 150,
    height: 300,
    width: 100,
    opacity: 0.15,
  },
  driftText: {
    fontSize: 7,
    marginBottom: 4,
    color: '#FFF',
  },
});
