/*
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageHeader } from '../../components/ui/PageHeader';
import { DurationSelector } from '../../components/DurationSelector';
import { Button } from '../../components/ui/Button';
import { ThemedText } from '../../components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View style={{ flex: 1 }}>

            {/ * Background * /}
            <LinearGradient
                colors={[
                    '#050505',
                    '#101010',
                    '#0D0D0D',
                    '#050505',
                ]}
                locations={[0, 0.25, 0.7, 1]}
                style={StyleSheet.absoluteFill}
            />

            {/ * Central glow * /}
            <View style={styles.centerGlow} />

            {/ * Vertical texture * /}
            <View style={styles.textureOverlay} />

            <View style={[styles.container, { paddingTop: insets.top }]}>
                <PageHeader
                    title={t('mission.create_title')}
                />

                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleText}>
                        Configurez votre mission
                    </Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.tabletCenteredContainer}>
                    <View
                        style={[
                            styles.content,
                            { paddingBottom: 20 + insets.bottom }
                        ]}
                    >
                        <Animated.View
                            style={styles.formContainer}
                            entering={FadeInUp.delay(300).duration(600)}
                        >
                            <DurationSelector
                                duration={duration}
                                setDuration={setDuration}
                                customDuration={customDuration}
                                setCustomDuration={setCustomDuration}
                                isCustomInvalid={isCustomInvalid}
                            />
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(500).duration(600)}
                            style={styles.footer}
                        >
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

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    centerGlow: {
        position: 'absolute',
        top: '20%',
        left: '-15%',
        right: '-15%',
        height: 500,

        backgroundColor: 'rgba(255,255,255,0.025)',

        borderRadius: 500,

        transform: [{ scaleX: 1.6 }],
    },

    textureOverlay: {
        ...StyleSheet.absoluteFillObject,

        borderLeftWidth: 1,
        borderRightWidth: 1,

        borderLeftColor: 'rgba(255,255,255,0.015)',
        borderRightColor: 'rgba(255,255,255,0.015)',
    },
    subtitleContainer: {
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    subtitleText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 20,
        color: '#F2E8CF',
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 1,
    },
    separator: {
        height: 1.5,
        backgroundColor: 'rgba(242, 232, 207, 0.12)',
        width: '100%',
    },
    tabletCenteredContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 1100,
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'space-between',
        marginTop: 20,
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
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: 'rgba(242, 232, 207, 0.6)',
        letterSpacing: 1,
    },
    createButton: {
        width: '100%',
    },
});
*/

import React from 'react';
import { View } from 'react-native';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';

export default function CreateMissionScreen() {
    return (
        <View style={{ flex: 1 }}>
            <AgentHomeBackground />
        </View>
    );
}

