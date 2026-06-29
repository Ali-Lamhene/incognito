import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { PageHeader } from '../../components/ui/PageHeader';
import { useJoinMission } from '../../hooks/useJoinMission';
import { Theme } from '../../constants/Theme';
import { useTranslation } from '../../hooks/useTranslation';

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
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 10) }]}
                showsVerticalScrollIndicator={false}
            >
                <PageHeader 
                    title={t('join.title')} 
                    showSeparator 
                />

                <View style={styles.heroContainer}>
                    <Image 
                        source={require('../../assets/UI/join_hero.png')} 
                        style={styles.heroImage} 
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.contentWrapper}>
                    {/* Scan Card */}
                    <View>
                        <TouchableOpacity style={styles.cardRow} onPress={handleScan} activeOpacity={0.7}>
                            <View style={styles.cardIconContainer}>
                                <MaterialCommunityIcons name="qrcode-scan" size={40} color={Theme.colors.red} />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{t('join.scan_title')}</Text>
                                <View style={styles.redUnderline} />
                                <Text style={styles.cardSubtitle}>{t('join.scan_desc')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={Theme.colors.red} />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <LinearGradient
                            colors={['transparent', 'rgba(255, 255, 255, 0.2)']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.dividerLine}
                        />
                        <Text style={styles.dividerText}>{t('join.or')}</Text>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.2)', 'transparent']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.dividerLine}
                        />
                    </View>

                    {/* Manual Code Card */}
                    <View style={[styles.cardColumn, styles.contentBlock]}>
                        <View style={styles.manualTextContainer}>
                            <Text style={styles.cardTitle}>{t('join.manual_title')}</Text>
                            <View style={styles.redUnderline} />
                            <Text style={styles.cardSubtitle}>{t('join.manual_desc')}</Text>
                        </View>
                        
                        <View style={[styles.inputContainer, error && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={18} color={Theme.colors.red} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('join.code_placeholder')}
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                value={manualCode}
                                onChangeText={onChangeCode}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>
                        
                        {error && (
                            <Text style={styles.errorText}>{t('join.invalid_code')}</Text>
                        )}

                        <TouchableOpacity 
                            style={[styles.joinButton, !manualCode.trim() && styles.joinButtonDisabled]} 
                            onPress={handleJoin}
                            disabled={!manualCode.trim()}
                            activeOpacity={0.8}
                        >
                            <FontAwesome5 name="user-secret" size={16} color={!manualCode.trim() ? "rgba(255, 255, 255, 0.4)" : "#FFF"} style={styles.btnIcon} />
                            <Text style={[styles.joinButtonText, !manualCode.trim() && styles.joinButtonTextDisabled]}>{t('join.btn_join')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120, // Prevents image from becoming too small
        marginTop: 0,
        // marginBottom: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    contentWrapper: {
        paddingHorizontal: 20,
        gap: 8,
        paddingBottom: 10,
    },
    contentBlock: {
        marginVertical: 5,
    },
    cardRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        padding: 12, // Reduced from 15
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardColumn: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        padding: 12, // Reduced from 15
    },
    cardIconContainer: {
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    manualTextContainer: {
        marginBottom: 10, // Reduced from 15
    },
    cardTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 19, // Reduced slightly from 20
        color: '#D1D1D1',
        letterSpacing: 1,
        marginBottom: 2, // Reduced from 4
    },
    redUnderline: {
        width: 30,
        height: 2,
        backgroundColor: Theme.colors.red,
        marginBottom: 6, // Reduced from 8
    },
    cardSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 18,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginVertical: 0, // Reduced from 5
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontFamily: 'BebasNeue-Bold',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 18,
        marginHorizontal: 15,
        letterSpacing: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        height: 42, // Reduced from 45
        marginBottom: 8, // Reduced from 10
    },
    inputError: {
        borderColor: Theme.colors.red,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
    },
    errorText: {
        color: Theme.colors.red,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        marginTop: -5,
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: Theme.colors.red,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42, // Reduced from 45
        borderRadius: 6,
    },
    joinButtonDisabled: {
        backgroundColor: '#1A1A1A',
        borderColor: '#2A2A2A',
        borderWidth: 1,
    },
    btnIcon: {
        marginRight: 10,
    },
    joinButtonText: {
        fontFamily: 'BebasNeue-Bold',
        color: '#FFF',
        fontSize: 18,
        letterSpacing: 1,
    },
    joinButtonTextDisabled: {
        color: 'rgba(255, 255, 255, 0.4)',
    },
});
