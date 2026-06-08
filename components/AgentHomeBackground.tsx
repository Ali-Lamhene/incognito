import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export function AgentHomeBackground() {
  const scanlineY = useSharedValue(-height);

  useEffect(() => {
    // Global scanline animation
    scanlineY.value = withRepeat(
      withTiming(height, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, [scanlineY]);

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanlineY.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(1500)} style={styles.backgroundContainer}>
      <Image
        source={require('../assets/images/agent_silhouette_rain.jpg')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.backgroundOverlay} />

      {/* HUD Grid */}
      <View style={styles.hudGrid}>
        {[...Array(6)].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 15}%` }]} />
        ))}
        {[...Array(6)].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 15}%` }]} />
        ))}
      </View>

      {/* Moving Scanline */}
      <Animated.View style={[styles.atmosphereScanline, scanlineStyle]} />

      <Image
        source={require('../assets/images/tactical_texture.jpg')}
        style={styles.tacticalOverlay}
        contentFit="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 8, 0.75)',
  },
  tacticalOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  hudGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.015,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFF',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFF',
  },
  atmosphereScanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
});
