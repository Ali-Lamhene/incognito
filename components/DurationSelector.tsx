import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../constants/Theme';

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
}: DurationSelectorProps) {

    React.useEffect(() => {
        if (duration !== 'CUSTOM') {
            setDuration('CUSTOM');
        }
    }, []);

    let totalMins = parseInt(customDuration, 10) || 20;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    const canSubHours = hours > 0;
    const canAddHours = totalMins < 24 * 60;
    const canSubMins = totalMins > 5;
    const canAddMins = totalMins < 24 * 60;

    const handleAddMins = (amount: number) => {
        let newMins = totalMins + amount;
        if (newMins < 5) newMins = 5;
        if (newMins > 24 * 60) newMins = 24 * 60;
        setCustomDuration(String(newMins));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Ionicons name="stopwatch-outline" size={18} color={Theme.colors.red} />
                <Text style={styles.headerText}>DURÉE DE LA MISSION</Text>
            </View>

            {/* Custom Duration Card */}
            <View style={styles.customCard}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: Theme.colors.totalBlack, opacity: 0.6, borderRadius: 8 }]} />

                <View style={styles.customBody}>
                    <View style={styles.counterSection}>
                        <View style={styles.counterCol}>
                            <TouchableOpacity onPress={() => handleAddMins(60)} hitSlop={10} disabled={!canAddHours}>
                                <Ionicons name="chevron-up" color={canAddHours ? Theme.colors.text.light : Theme.colors.text.muted} size={28} />
                            </TouchableOpacity>
                            <View style={styles.numberBox}>
                                <Text style={styles.counterValue}>{String(hours).padStart(2, '0')}</Text>
                            </View>
                            <Text style={styles.counterLabel}>HEURES</Text>
                            <TouchableOpacity onPress={() => handleAddMins(-60)} hitSlop={10} disabled={!canSubHours}>
                                <Ionicons name="chevron-down" color={canSubHours ? Theme.colors.text.light : Theme.colors.text.muted} size={28} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.counterCol}>
                            <TouchableOpacity onPress={() => handleAddMins(5)} hitSlop={10} disabled={!canAddMins}>
                                <Ionicons name="chevron-up" color={canAddMins ? Theme.colors.text.light : Theme.colors.text.muted} size={28} />
                            </TouchableOpacity>
                            <View style={styles.numberBox}>
                                <Text style={styles.counterValue}>{String(mins).padStart(2, '0')}</Text>
                            </View>
                            <Text style={styles.counterLabel}>MINUTES</Text>
                            <TouchableOpacity onPress={() => handleAddMins(-5)} hitSlop={10} disabled={!canSubMins}>
                                <Ionicons name="chevron-down" color={canSubMins ? Theme.colors.text.light : Theme.colors.text.muted} size={28} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 4,
    },
    headerText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: Theme.colors.text.light,
        letterSpacing: 1,
    },
    presetsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    presetBox: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    presetBoxActive: {
        borderColor: Theme.colors.red,
    },
    presetValue: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: Theme.colors.text.light,
        opacity: 0.7,
    },
    presetValueActive: {
        color: Theme.colors.red,
        opacity: 1,
    },
    presetUnit: {
        fontSize: 14,
    },
    connector: {
        width: 10,
        height: 2,
        backgroundColor: Theme.colors.border,
    },
    activeTriangle: {
        position: 'absolute',
        bottom: -6,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Theme.colors.red,
    },
    customCard: {
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    customTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: Theme.colors.red,
        letterSpacing: 1,
    },
    customToggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: Theme.colors.surface,
        borderWidth: 1.5,
        borderColor: Theme.colors.border,
        padding: 2,
        justifyContent: 'center',
    },
    customToggleActive: {
        borderColor: Theme.colors.red,
        backgroundColor: Theme.colors.red,
    },
    customToggleThumb: {
        width: 17,
        height: 17,
        borderRadius: 8.5,
    },
    customBody: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    counterCol: {
        alignItems: 'center',
        gap: 0,
    },
    numberBox: {
        backgroundColor: Theme.colors.surface,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: 6,
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 1,
    },
    counterValue: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 32,
        color: Theme.colors.text.light,
    },
    counterLabel: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 10,
        color: Theme.colors.text.light,
        opacity: 0.6,
    },
    colon: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: Theme.colors.text.light,
        opacity: 0.5,
        marginBottom: 10, // Center with the number boxes
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 5,
    },
    infoText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 8,
        color: Theme.colors.text.light,
        opacity: 0.5,
        letterSpacing: 0.5,
    },
});
