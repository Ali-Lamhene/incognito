import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/Theme';



export interface AgentHomeBackgroundProps {
  totalBlack?: boolean;
}

export function AgentHomeBackground({ totalBlack = false }: AgentHomeBackgroundProps) {
  const bgColor = totalBlack ? Theme.colors.totalBlack : Theme.colors.background;

  return (
    <Animated.View entering={FadeIn.duration(1500)} style={[styles.backgroundContainer, { backgroundColor: bgColor }]}>
      {/* Background Image: City silhouettes (highly visible in the center) */}
      <Image
        source={require('../assets/UI/texture_city.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Vertical Vignette: Stronger dark overlay at top/bottom, clear center */}
      <LinearGradient
        colors={[bgColor, 'transparent', 'transparent', bgColor]}
        locations={[0, 0.25, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Horizontal Vignette: Stronger dark overlay at left/right edges, clear center */}
      <LinearGradient
        colors={[bgColor, 'transparent', 'transparent', bgColor]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.15, 0.85, 1]}
        style={StyleSheet.absoluteFill}
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
    opacity: 0.65, // La ville au centre est plus visible
  },
});
