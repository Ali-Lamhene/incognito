import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useSession } from '../../context/SessionContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function JoinMissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { checkSessionExists } = useSession();
    const { t } = useTranslation();
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState(false);

    const handleJoin = async () => {
        if (manualCode.trim()) {
            const normalized = manualCode.trim().toUpperCase();
            const exists = await checkSessionExists(normalized);
            if (exists) {
                router.replace(`/lobby/${normalized}`);
            } else {
                setError(true);
                // Reset error after 2 seconds
                setTimeout(() => setError(false), 2000);
            }
        }
    };

    const handleScan = () => {
        router.push('/mission/scan');
    };

    return (
        <View style={styles.container}>
            {/* Background for consistency */}
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
                            <ThemedText type="code" style={styles.backText}>{'<< ' + t('common.return')}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText type="subtitle" style={styles.screenTitle}>{t('home.join_mission_subtitle')}</ThemedText>
                        <View style={styles.headerLine} />
                    </Animated.View>

                    {/* Manual Entry Section */}
                    <Animated.View style={styles.formContainer} entering={FadeInUp.delay(300).duration(600)}>
                        <View style={styles.inputWrapper}>
                            <View style={styles.labelRow}>
                                <Ionicons name="keypad-outline" size={12} color="rgba(255,255,255,0.4)" />
                                <ThemedText type="code" style={styles.inputLabel}>
                                    {t('mission.join_code_label')}
                                </ThemedText>
                            </View>

                            <View style={[
                                styles.premiumInputContainer,
                                error && { borderColor: '#FF6B6B', backgroundColor: 'rgba(255, 107, 107, 0.05)' }
                            ]}>
                                <View style={[styles.inputGlow, error && { backgroundColor: '#FF6B6B' }]} />
                                <TextInput
                                    style={styles.codeInput}
                                    placeholder={t('mission.join_code_placeholder')}
                                    placeholderTextColor="rgba(255,255,255,0.15)"
                                    value={manualCode}
                                    onChangeText={(val) => {
                                        setManualCode(val);
                                        if (error) setError(false);
                                    }}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    onPress={handleJoin}
                                    disabled={!manualCode.trim()}
                                    style={[
                                        styles.connectBtnAction,
                                        manualCode.trim() ? styles.connectBtnActive : styles.connectBtnDisabled,
                                        error && { backgroundColor: '#FF6B6B' }
                                    ]}
                                >
                                    <ThemedText type="code" style={styles.connectBtnText}>
                                        {t('mission.btn_join_code')}
                                    </ThemedText>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={manualCode.trim() ? (error ? "#FFF" : "#000") : "rgba(255,255,255,0.3)"}
                                    />
                                </TouchableOpacity>
                            </View>
                            {error && (
                                <Animated.View entering={FadeInDown} style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={12} color="#FF6B6B" />
                                    <ThemedText type="code" style={styles.errorText}>
                                        {t('mission.mission_not_found')}
                                    </ThemedText>
                                </Animated.View>
                            )}
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <ThemedText type="code" style={styles.dividerText}>{t('common.or')}</ThemedText>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Scan Option */}
                        <TouchableOpacity
                            onPress={handleScan}
                            style={styles.scanOption}
                            activeOpacity={0.7}
                        >
                            <View style={styles.scanIconContainer}>
                                <Ionicons name="scan-outline" size={32} color="#FFF" />
                            </View>
                            <View>
                                <ThemedText type="subtitle" style={styles.scanTitle}>{t('home.join_mission_title')}</ThemedText>
                                <ThemedText type="code" style={styles.scanSubtitle}>{t('lobby.scan_instruction')}</ThemedText>
                            </View>
                        </TouchableOpacity>
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
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.3,
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
        gap: 40,
    },
    inputWrapper: {
        gap: 12,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 4,
    },
    inputLabel: {
        fontSize: 10,
        opacity: 0.5,
        letterSpacing: 2,
    },
    premiumInputContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        alignItems: 'center',
        height: 60,
        overflow: 'hidden',
    },
    inputGlow: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#FFF',
        opacity: 0.3,
    },
    codeInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 13,
        paddingHorizontal: 15,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    connectBtnAction: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    connectBtnActive: {
        backgroundColor: '#FFF',
    },
    connectBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    connectBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#000',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingLeft: 4,
        marginTop: 4,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 10,
        letterSpacing: 1,
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
    scanOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    scanIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    scanTitle: {
        fontSize: 16,
        letterSpacing: 1,
        color: '#FFF',
    },
    scanSubtitle: {
        fontSize: 10,
        opacity: 0.5,
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
