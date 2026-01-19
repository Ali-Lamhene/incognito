import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export function Vignette() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Simple simulated vignette with borders and shadows */}
            <View style={styles.vignetteTop} />
            <View style={styles.vignetteBottom} />
            <View style={styles.vignetteLeft} />
            <View style={styles.vignetteRight} />
        </View>
    );
}

const styles = StyleSheet.create({
    vignetteTop: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: height * 0.3,
        backgroundColor: 'rgba(0,0,0,0.8)',
        opacity: 0.1, // Very subtle for cinematic feel
    },
    vignetteBottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: height * 0.3,
        backgroundColor: 'rgba(0,0,0,0.8)',
        opacity: 0.1,
    },
    vignetteLeft: {
        position: 'absolute',
        left: 0,
        height: '100%',
        width: width * 0.2,
        backgroundColor: 'rgba(0,0,0,0.8)',
        opacity: 0.05,
    },
    vignetteRight: {
        position: 'absolute',
        right: 0,
        height: '100%',
        width: width * 0.2,
        backgroundColor: 'rgba(0,0,0,0.8)',
        opacity: 0.05,
    },
});
