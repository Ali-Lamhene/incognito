import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export function LobbyBackground() {
    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={require('../assets/images/surveillance_desk_monochrome.jpg')}
                style={styles.backgroundImage}
                contentFit="cover"
            />
            <View style={styles.backgroundOverlay} />
            <Image
                source={require('../assets/images/tactical_texture.jpg')}
                style={styles.tacticalOverlay}
                contentFit="cover"
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
        opacity: 0.4,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
    },
    tacticalOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
    },
});
