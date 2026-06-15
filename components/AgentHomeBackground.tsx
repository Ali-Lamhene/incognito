import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/Theme';



export interface AgentHomeBackgroundProps {
  totalBlack?: boolean;
}

export function AgentHomeBackground({ totalBlack = false }: AgentHomeBackgroundProps) {
  const bgColor = totalBlack ? Theme.colors.totalBlack : Theme.colors.background;

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: bgColor }]}>
      {/* Background Image: City silhouettes (highly visible in the center) */}
      <Image
        source={require('../assets/UI/texture_city.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Vertical Vignette: Stronger dark overlay at top/bottom, clear center */}
      <LinearGradient
        colors={[bgColor, 'transparent', 'transparent', bgColor]}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Horizontal Vignette: Stronger dark overlay at left/right edges, clear center */}
      <LinearGradient
        colors={[bgColor, 'transparent', 'transparent', bgColor]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.25, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.4, // Réduit pour rendre la ville moins visible
  },
});
