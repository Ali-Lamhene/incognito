import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface JoinCodeInputProps {
    value: string;
    onChangeText: (val: string) => void;
    onSubmit: () => void;
    error: boolean;
}

export function JoinCodeInput({
    value,
    onChangeText,
    onSubmit,
    error
}: JoinCodeInputProps) {
    const { t } = useTranslation();
    const hasValue = value.trim().length > 0;

    return (
        <View style={styles.inputWrapper}>
            <View style={styles.labelRow}>
                <Ionicons name="keypad-outline" size={12} color="rgba(255,255,255,0.4)" />
                <ThemedText type="code" style={styles.inputLabel}>
                    {t('mission.join_code_label')}
                </ThemedText>
            </View>

            <View style={[
                styles.premiumInputContainer,
                error && { borderColor: '#8B1E1E', backgroundColor: 'rgba(139, 30, 30, 0.05)' }
            ]}>
                <View style={[styles.inputGlow, error && { backgroundColor: '#8B1E1E' }]} />
                <TextInput
                    style={styles.codeInput}
                    placeholder={t('mission.join_code_placeholder')}
                    placeholderTextColor="rgba(255,255,255,0.15)"
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={20}
                />
                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={!hasValue}
                    style={[
                        styles.connectBtnAction,
                        hasValue ? styles.connectBtnActive : styles.connectBtnDisabled,
                        error && { backgroundColor: '#8B1E1E' }
                    ]}
                >
                    <ThemedText type="code" style={styles.connectBtnText}>
                        {t('mission.btn_join_code')}
                    </ThemedText>
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={hasValue ? (error ? "#FFF" : "#000") : "rgba(255,255,255,0.3)"}
                    />
                </TouchableOpacity>
            </View>
            {error && (
                <Animated.View entering={FadeInDown} style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={12} color="#8B1E1E" />
                    <ThemedText type="code" style={styles.errorText}>
                        {t('mission.mission_not_found')}
                    </ThemedText>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        gap: 12,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 4,
    },
    inputLabel: {
        fontSize: 10,
        opacity: 0.5,
        letterSpacing: 2,
    },
    premiumInputContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        alignItems: 'center',
        height: 60,
        overflow: 'hidden',
    },
    inputGlow: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#FFF',
        opacity: 0.3,
    },
    codeInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 13,
        paddingHorizontal: 15,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    connectBtnAction: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    connectBtnActive: {
        backgroundColor: '#FFF',
    },
    connectBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    connectBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#000',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingLeft: 4,
        marginTop: 4,
    },
    errorText: {
        color: '#8B1E1E',
        fontSize: 10,
        letterSpacing: 1,
    },
});
