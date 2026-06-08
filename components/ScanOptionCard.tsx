import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface ScanOptionCardProps {
    onPress: () => void;
}

export function ScanOptionCard({ onPress }: ScanOptionCardProps) {
    const { t } = useTranslation();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.scanOption}
            activeOpacity={0.7}
        >
            <View style={styles.scanIconContainer}>
                <Ionicons name="scan-outline" size={32} color="#FFF" />
            </View>
            <View style={styles.textContainer}>
                <ThemedText type="subtitle" style={styles.scanTitle}>
                    {t('home.join_mission_title')}
                </ThemedText>
                <ThemedText type="code" style={styles.scanSubtitle}>
                    {t('lobby.scan_instruction')}
                </ThemedText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    scanOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    scanIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textContainer: {
        flex: 1,
    },
    scanTitle: {
        fontSize: 16,
        letterSpacing: 1,
        color: '#FFF',
    },
    scanSubtitle: {
        fontSize: 10,
        opacity: 0.5,
        marginTop: 2,
    },
});
