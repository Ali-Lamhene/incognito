import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme } from '../constants/Theme';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export function AgentAdvice() {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/UI/folder.png')} 
                style={styles.folderIcon} 
                contentFit="contain" 
            />
            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>CONSEIL AGENT</Text>
                </View>
                <Text style={styles.description}>
                    Le choix du terrain influence le type de mission et les interactions possibles
                </Text>
            </View>
            <Ionicons 
                name="finger-print-outline" 
                size={50} 
                color={Theme.colors.text.light} 
                style={styles.fingerprint} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 0,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        marginTop: 10,
        gap: 3,
        overflow: 'hidden',
    },
    folderIcon: {
        width: 82,
        height: 82,
        opacity: 0.9,
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    title: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: Theme.colors.red,
        letterSpacing: 1,
    },
    description: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 9,
        width: '80%',
        color: Theme.colors.text.light,
        opacity: 0.6,
        lineHeight: 14,
    },
    fingerprint: {
        position: 'absolute',
        right: 5,
        opacity: 0.02,
        transform: [{ rotate: '-20deg' }],
    },
});
