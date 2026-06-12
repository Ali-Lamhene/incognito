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
            <ThemedText style={styles.selectorLabel}>{t('mission.duration')}</ThemedText>
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
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected
                                    ]}
                                >
                                    {t(`mission.options.${opt}`)}
                                </ThemedText>
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
                                        <ThemedText style={styles.customInputUnit}>MIN</ThemedText>
                                    </Animated.View>
                                    {isCustomInvalid && (
                                        <ThemedText style={styles.durationErrorText}>
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
        gap: 15,
        width: '100%',
    },
    selectorLabel: {
        color: 'rgba(242, 232, 207, 0.6)',
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        borderWidth: 1.5,
        borderColor: 'rgba(242, 232, 207, 0.15)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        backgroundColor: '#161616',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    optionButtonSelected: {
        borderColor: '#D62B28',
        backgroundColor: '#D62B28',
    },
    optionText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: 'rgba(242, 232, 207, 0.8)',
        letterSpacing: 1.2,
    },
    optionTextSelected: {
        color: '#FFF',
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(242, 232, 207, 0.4)',
        paddingHorizontal: 5,
        marginLeft: 5,
    },
    customInput: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Bold',
        fontSize: 20,
        width: 40,
        textAlign: 'center',
        paddingVertical: 0,
    },
    customInputUnit: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: '#F2E8CF',
        opacity: 0.6,
        marginLeft: 4,
    },
    durationErrorText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 12,
        color: '#D62B28',
        marginTop: 4,
        position: 'absolute',
        bottom: -16,
        width: 150,
    },
});
