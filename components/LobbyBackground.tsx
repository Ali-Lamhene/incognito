import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export function LobbyBackground() {
    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={require('../assets/UI/texture_city.png')}
                style={styles.backgroundImage}
                contentFit="cover"
            />
            {/* Dark overlay to ensure text readability if needed */}
            <View style={styles.backgroundOverlay} />
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
});
