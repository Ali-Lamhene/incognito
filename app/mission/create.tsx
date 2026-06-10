import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';
import { AgentScreenHeader } from '../../components/AgentScreenHeader';
import { DurationSelector } from '../../components/DurationSelector';
import { Button } from '../../components/ui/Button';
import { ThemedText } from '../../components/ThemedText';

import { useTranslation } from '../../hooks/useTranslation';
import { useCreateMission } from '../../hooks/useCreateMission';

export default function CreateMissionScreen() {
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
                    <AgentScreenHeader
                        title={t('mission.create_title')}
                        backLabel={t('mission.abort_mission')}
                    />

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

                        <Button
                             title={t('mission.btn_init')}
                             onPress={handleCreate}
                             disabled={isCustomInvalid}
                             style={styles.createButton}
                             variant="primary"
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
