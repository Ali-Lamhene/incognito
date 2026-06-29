import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LobbyAgentsList } from '../../components/LobbyAgentsList';
// Removed LobbyBackground
import { PageHeader } from '../../components/ui/PageHeader';
import { LobbyModals } from '../../components/LobbyModals';
import { LobbyQRFrame } from '../../components/LobbyQRFrame';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useLobby } from '../../hooks/useLobby';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';

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
                    <PageHeader
                        title={t('lobby.title')}
                        onBack={handleBack}
                        showSeparator={true}
                    />

                    {/* Central Code & QR */}
                    <LobbyQRFrame
                        code={code}
                        scannerStyle={animatedScannerStyle}
                        onCopy={copyToClipboard}
                    >
                        {/* Footer Action */}
                        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.footer}>
                            {isHost && (
                                <>
                                    <Button
                                        title={t('lobby.btn_deploy_simple')}
                                        onPress={handleDeploy}
                                        disabled={agents.length < 1}
                                        style={styles.startButton}
                                        variant="primary"
                                        icon="custom-target"
                                    />
                                    {agents.length < 2 && (
                                        <View style={styles.aloneHintContainer}>
                                            <Ionicons name="warning-outline" size={24} color={Theme.colors.red} />
                                            <View style={styles.aloneHintTextContainer}>
                                                <Text style={styles.aloneHintTitle}>{t('lobby.waiting_agents')}</Text>
                                                <Text style={styles.aloneHintSubtitle}>{t('lobby.recruitment_required')}</Text>
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </Animated.View>
                    </LobbyQRFrame>

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
    destroyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 4,
        marginTop: 2,
    },
    destroyText: {
        fontFamily: 'Montserrat-Regular',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    startButton: {
        width: '100%',
        backgroundColor: Theme.colors.red,
        borderRadius: 8,
    },
    footer: {
        width: '100%',
        gap: 10,
        marginTop: 0,
    },
    aloneHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 10,
        gap: 12,
    },
    aloneHintTextContainer: {
        flex: 1,
    },
    aloneHintTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: Theme.colors.red,
        letterSpacing: 1,
        marginBottom: 0,
    },
    aloneHintSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 10,
        color: '#FFF',
        opacity: 0.8,
        lineHeight: 14,
    }
});
