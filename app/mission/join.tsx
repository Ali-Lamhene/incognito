import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';
import { AgentScreenHeader } from '../../components/AgentScreenHeader';
import { JoinCodeInput } from '../../components/JoinCodeInput';
import { ScanOptionCard } from '../../components/ScanOptionCard';
import { ThemedText } from '../../components/ThemedText';
import { useTranslation } from '../../hooks/useTranslation';
import { useJoinMission } from '../../hooks/useJoinMission';

export default function JoinMissionScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const {
        manualCode,
        onChangeCode,
        error,
        handleJoin,
        handleScan
    } = useJoinMission();

    return (
        <View style={styles.container}>
            <AgentHomeBackground />

            <View style={styles.tabletCenteredContainer}>
                <View style={[
                    styles.content,
                    { paddingTop: insets.top + 20, paddingBottom: 20 + insets.bottom }
                ]}>

                    {/* Header */}
                    <AgentScreenHeader title={t('home.join_mission_subtitle')} />

                    {/* Form Container */}
                    <Animated.View style={styles.formContainer} entering={FadeInUp.delay(300).duration(600)}>
                        <JoinCodeInput
                            value={manualCode}
                            onChangeText={onChangeCode}
                            onSubmit={handleJoin}
                            error={error}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <ThemedText type="code" style={styles.dividerText}>{t('common.or')}</ThemedText>
                            <View style={styles.dividerLine} />
                        </View>

                        <ScanOptionCard onPress={handleScan} />
                    </Animated.View>

                    <View style={styles.footer}>
                        <ThemedText type="code" style={styles.footerTag}>SECURE_PROTOCOL_v4.2</ThemedText>
                    </View>
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
        gap: 40,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        opacity: 0.3,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    dividerText: {
        fontSize: 10,
    },
    footer: {
        alignItems: 'center',
    },
    footerTag: {
        fontSize: 8,
        opacity: 0.3,
        letterSpacing: 2,
    }
});
