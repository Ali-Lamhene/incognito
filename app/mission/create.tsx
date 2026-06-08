import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';
import { DurationSelector } from '../../components/DurationSelector';
import { MainButton } from '../../components/MainButton';
import { ThemedText } from '../../components/ThemedText';

import { useTranslation } from '../../hooks/useTranslation';
import { useCreateMission } from '../../hooks/useCreateMission';

export default function CreateMissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const {
        duration,
        setDuration,
        customDuration,
        setCustomDuration,
        isCustomInvalid,
        handleCreate
    } = useCreateMission();

    return (
        <View style={styles.container}>
            <AgentHomeBackground />

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
                        <DurationSelector
                            duration={duration}
                            setDuration={setDuration}
                            customDuration={customDuration}
                            setCustomDuration={setCustomDuration}
                            isCustomInvalid={isCustomInvalid}
                        />
                    </Animated.View>

                    {/* Footer Action */}
                    <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.footer}>
                        <View style={styles.summaryBox}>
                            <ThemedText type="code" style={styles.summaryText}>
                                {t('mission.config_summary')}: {duration === 'CUSTOM' ? `${customDuration} MIN` : t(`mission.options.${duration}`)}
                            </ThemedText>
                        </View>

                        <MainButton
                             title={t('mission.btn_init')}
                             onPress={handleCreate}
                             disabled={isCustomInvalid}
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
    },
});
