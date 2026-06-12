import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, View, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useProfileStore } from '../../store/profileStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const { soundEnabled, musicEnabled, hapticsEnabled, language, toggleSound, toggleMusic, toggleHaptics, setLanguage } = useSettingsStore();
    const { profile } = useProfileStore();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                <Text style={styles.headerTitle}>{t('settings.title')}</Text>
            </Animated.View>

            <Animated.ScrollView
                entering={FadeInUp.delay(200).duration(600)}
                style={styles.content}
                contentContainerStyle={{ gap: 30, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.section_profile')}</Text>
                    <View style={styles.profileCard}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                <Ionicons name={(profile?.avatar as any) || "person"} size={24} color="#FFF" />
                            </View>
                            <View>
                                <Text style={styles.profileName}>{profile?.codename || t('common.unknown')}</Text>
                                <Text style={styles.profileId}>CODE AGENT : {profile?.id || '---'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* System Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.section_device')}</Text>

                    {/* Audio SFX */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="volume-high-outline" size={20} color="#FFF" />
                            <Text style={styles.settingText}>{t('settings.audio_fx')}</Text>
                        </View>
                        <Switch
                            value={soundEnabled}
                            onValueChange={toggleSound}
                            trackColor={{ false: '#333', true: '#8B1E1E' }}
                            thumbColor={'#FFF'}
                        />
                    </View>

                    {/* Ambient Music */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="musical-notes-outline" size={20} color="#FFF" />
                            <Text style={styles.settingText}>{t('settings.ambient_music') || 'Musique d\'ambiance'}</Text>
                        </View>
                        <Switch
                            value={musicEnabled}
                            onValueChange={toggleMusic}
                            trackColor={{ false: '#333', true: '#8B1E1E' }}
                            thumbColor={'#FFF'}
                        />
                    </View>

                    {/* Haptics */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="pulse" size={20} color="#FFF" />
                            <Text style={styles.settingText}>{t('settings.haptics') || 'Vibrations (Mode Furtif)'}</Text>
                        </View>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={toggleHaptics}
                            trackColor={{ false: '#333', true: '#8B1E1E' }}
                            thumbColor={'#FFF'}
                        />
                    </View>

                    {/* Language */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="language-outline" size={20} color="#FFF" />
                            <Text style={styles.settingText}>{t('settings.language')}</Text>
                        </View>
                        <View style={styles.langToggle}>
                            <TouchableOpacity
                                onPress={() => setLanguage('fr')}
                                style={[styles.langOption, language === 'fr' && styles.langActive]}
                            >
                                <Text style={{ fontFamily: 'BebasNeue-Bold', color: language === 'fr' ? '#000' : '#FFF', fontSize: 14 }}>FR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLanguage('en')}
                                style={[styles.langOption, language === 'en' && styles.langActive]}
                            >
                                <Text style={{ fontFamily: 'BebasNeue-Bold', color: language === 'en' ? '#000' : '#FFF', fontSize: 14 }}>EN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* System Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.section_info')}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('settings.version')}</Text>
                        <Text style={styles.infoValue}>v1.0.0 (BETA)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('settings.contact')}</Text>
                        <Text style={styles.infoValue}>otakumi.factory@gmail.com</Text>
                    </View>
                </View>

            </Animated.ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 32,
        color: '#F2E8CF',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
    },
    section: {
        gap: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: 'rgba(242, 232, 207, 0.6)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 6,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#F2E8CF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    profileName: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: '#FFF',
        letterSpacing: 1.5,
    },
    profileId: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 2,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#FFF',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    infoValue: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#FFF',
    },
    langToggle: {
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#1a1a1a',
        padding: 3,
        borderRadius: 4,
    },
    langOption: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 2,
    },
    langActive: {
        backgroundColor: '#F2E8CF',
    },
});
