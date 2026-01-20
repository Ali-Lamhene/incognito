import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainButton } from '../../components/MainButton';
import { ThemedText } from '../../components/ThemedText';

import { useSession } from '../../context/SessionContext';
import { generateMissionCode } from '../../utils/missionCode';

import { useTranslation } from '../../hooks/useTranslation';

const THREAT_LEVELS = ['RECRUIT', 'AGENT', 'DOUBLE_ZERO'];
const DURATIONS = ['15_MIN', '45_MIN', '2_HOURS', 'INFINITE'];
const PROTOCOLS = ['SOCIAL', 'ABSURD', 'RISKY'];

export default function CreateMissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { createSession } = useSession();
    const { t } = useTranslation();

    // Mission Parameters State
    const [threatLevel, setThreatLevel] = useState('AGENT');
    const [duration, setDuration] = useState('45_MIN');
    const [protocol, setProtocol] = useState('SOCIAL');

    const handleCreate = async () => {
        const missionCode = generateMissionCode();
        await createSession(missionCode, threatLevel);

        console.log("Mission Initialized:", { threatLevel, duration, protocol, missionCode });
        router.push(`/lobby/${missionCode}`);
    };

    const renderSelector = (label: string, options: string[], selected: string, onSelect: (val: string) => void) => (
        <View style={styles.selectorContainer}>
            <ThemedText type="code" style={styles.selectorLabel}>{label}</ThemedText>
            <View style={styles.optionsRow}>
                {options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => onSelect(opt)}
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
                    );
                })}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Background reuse for consistency */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require('../../assets/images/agent_silhouette_rain.png')}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
                <View style={styles.backgroundOverlay} />
                <Image
                    source={require('../../assets/images/tactical_texture.png')}
                    style={styles.tacticalOverlay}
                    contentFit="cover"
                />
            </View>

            <View style={styles.tabletCenteredContainer}>
                <View style={[
                    styles.content,
                    { paddingTop: insets.top + 20, paddingBottom: 20 + insets.bottom }
                ]}>

                    {/* Header */}
                    <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ThemedText type="code" style={styles.backText}>{'<< ' + t('mission.abort_mission')}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText type="subtitle" style={styles.screenTitle}>{t('mission.create_title')}</ThemedText>
                        <View style={styles.headerLine} />
                    </Animated.View>

                    {/* Parameters Form */}
                    <Animated.View style={styles.formContainer} entering={FadeInUp.delay(300).duration(600)}>
                        {renderSelector(t('mission.threat_level'), THREAT_LEVELS, threatLevel, setThreatLevel)}
                        {renderSelector(t('mission.duration'), DURATIONS, duration, setDuration)}
                        {renderSelector(t('mission.protocol'), PROTOCOLS, protocol, setProtocol)}
                    </Animated.View>

                    {/* Footer Action */}
                    <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.footer}>
                        <View style={styles.summaryBox}>
                            <ThemedText type="code" style={styles.summaryText}>
                                {t('mission.config_summary')}: {t(`mission.options.${threatLevel}`)} / {t(`mission.options.${duration}`)} / {t(`mission.options.${protocol}`)}
                            </ThemedText>
                        </View>

                        <MainButton
                            title={t('mission.btn_init')}
                            onPress={handleCreate}
                            style={styles.createButton}
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.3, // Darker for form readability
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
    },
    tacticalOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
    },
    tabletCenteredContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 1100,
        maxHeight: 800,
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'space-between',
    },
    backButton: {
        marginBottom: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    backText: {
        fontSize: 10,
        opacity: 0.6,
        letterSpacing: 2,
    },
    screenTitle: {
        color: '#FFF',
        fontSize: 24,
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    headerLine: {
        height: 1,
        backgroundColor: '#FFF',
        opacity: 0.3,
        marginTop: 10,
        width: '40%',
    },
    formContainer: {
        gap: 30,
        marginTop: 20,
    },
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
    footer: {
        gap: 15,
    },
    summaryBox: {
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 10,
        opacity: 0.4,
    },
    createButton: {
        width: '100%',
    }
});
