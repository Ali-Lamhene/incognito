import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

const DURATIONS = ['15_MIN', '30_MIN', '45_MIN', 'CUSTOM'];

interface DurationSelectorProps {
    duration: string;
    setDuration: (opt: string) => void;
    customDuration: string;
    setCustomDuration: (val: string) => void;
    isCustomInvalid: boolean;
}

export function DurationSelector({
    duration,
    setDuration,
    customDuration,
    setCustomDuration,
    isCustomInvalid
}: DurationSelectorProps) {
    const { t } = useTranslation();

    return (
        <View style={styles.selectorContainer}>
            <ThemedText type="code" style={styles.selectorLabel}>{t('mission.duration')}</ThemedText>
            <View style={styles.optionsRow}>
                {DURATIONS.map((opt) => {
                    const isSelected = duration === opt;
                    return (
                        <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => setDuration(opt)}
                                style={[
                                    styles.optionButton,
                                    isSelected && styles.optionButtonSelected
                                ]}
                            >
                                <ThemedText
                                    type="code"
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected
                                    ]}
                                >
                                    {t(`mission.options.${opt}`)}
                                </ThemedText>
                                {isSelected && <View style={styles.selectedCorner} />}
                            </TouchableOpacity>

                            {opt === 'CUSTOM' && isSelected && (
                                <View>
                                    <Animated.View entering={FadeInDown} style={styles.customInputContainer}>
                                        <TextInput
                                            style={styles.customInput}
                                            value={customDuration}
                                            onChangeText={setCustomDuration}
                                            keyboardType="numeric"
                                            placeholder="60"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            maxLength={3}
                                        />
                                        <ThemedText type="code" style={styles.customInputUnit}>MIN</ThemedText>
                                    </Animated.View>
                                    {isCustomInvalid && (
                                        <ThemedText type="code" style={styles.durationErrorText}>
                                            {t('mission.duration_error')}
                                        </ThemedText>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    selectorContainer: {
        gap: 12,
    },
    selectorLabel: {
        color: '#FFF',
        fontSize: 10,
        opacity: 0.5,
        letterSpacing: 1.5,
        marginBottom: 5,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    optionButtonSelected: {
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    optionText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        fontWeight: '600',
    },
    optionTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    selectedCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 6,
        height: 6,
        backgroundColor: '#000',
        transform: [{ rotate: '45deg' }, { translateX: 3 }, { translateY: -3 }]
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.4)',
        paddingHorizontal: 5,
        marginLeft: 5,
    },
    customInput: {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: 14,
        width: 40,
        textAlign: 'center',
        paddingVertical: 0,
    },
    customInputUnit: {
        fontSize: 8,
        color: '#FFF',
        opacity: 0.5,
        marginLeft: 4,
    },
    durationErrorText: {
        fontSize: 7,
        color: '#FF6B6B',
        marginTop: 4,
        position: 'absolute',
        bottom: -12,
        width: 100,
    },
});
