import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LobbyAgentsList } from '../../components/LobbyAgentsList';
import { LobbyBackground } from '../../components/LobbyBackground';
import { LobbyHeader } from '../../components/LobbyHeader';
import { LobbyModals } from '../../components/LobbyModals';
import { LobbyQRFrame } from '../../components/LobbyQRFrame';
import { MainButton } from '../../components/MainButton';
import { ThemedText } from '../../components/ThemedText';
import { useTranslation } from '../../hooks/useTranslation';
import { useLobby } from '../../hooks/useLobby';

export default function LobbyScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const {
        code,
        isHost,
        agents,
        animatedScannerStyle,
        modals: {
            showStartModal,
            setShowStartModal,
            showDestroyModal,
            setShowDestroyModal,
            showLeaveModal,
            setShowLeaveModal,
        },
        actions: {
            handleBack,
            handleAbort,
            confirmDestroy,
            confirmLeave,
            handleDeploy,
            confirmStart,
            copyToClipboard,
        }
    } = useLobby();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    animation: 'fade',
                    contentStyle: { backgroundColor: '#000' }
                }}
            />
            <LobbyBackground />

            <View style={styles.tabletCenteredContainer}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingTop: insets.top + 20,
                            paddingBottom: 20 + insets.bottom
                        }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <LobbyHeader
                        isHost={isHost}
                        onBack={handleBack}
                        onAbort={handleAbort}
                    />

                    {/* Central Code & QR */}
                    <LobbyQRFrame
                        code={code}
                        scannerStyle={animatedScannerStyle}
                        onCopy={copyToClipboard}
                    />

                    {/* Footer Action */}
                    {isHost && (
                        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.footer}>
                            <MainButton
                                title={agents.length < 2 ? t('lobby.waiting_agents') : t('lobby.btn_deploy')}
                                onPress={handleDeploy}
                                disabled={agents.length < 2}
                                style={styles.startButton}
                            />
                            {agents.length < 2 && (
                                <ThemedText type="code" style={styles.aloneHint}>
                                    {t('lobby.recruitment_required')}
                                </ThemedText>
                            )}
                        </Animated.View>
                    )}

                    {/* Agents List */}
                    <LobbyAgentsList agents={agents} />
                </ScrollView>
            </View>

            <LobbyModals
                showDestroyModal={showDestroyModal}
                showLeaveModal={showLeaveModal}
                showStartModal={showStartModal}
                setShowDestroyModal={setShowDestroyModal}
                setShowLeaveModal={setShowLeaveModal}
                setShowStartModal={setShowStartModal}
                onConfirmDestroy={confirmDestroy}
                onConfirmLeave={confirmLeave}
                onConfirmStart={confirmStart}
            />
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
    scrollContainer: {
        width: '100%',
        maxWidth: 1100,
        maxHeight: 900,
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'space-between',
        gap: 15,
        paddingBottom: 40,
    },
    startButton: {
        width: '100%',
    },
    footer: {
        gap: 15,
    },
    aloneHint: {
        fontSize: 8,
        color: '#FF6B6B',
        textAlign: 'center',
        opacity: 0.8,
        letterSpacing: 1,
    }
});
