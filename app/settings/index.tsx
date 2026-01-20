import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useProfileStore } from '../../store/profileStore';
import { useSettingsStore } from '../../store/settingsStore';

import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { soundEnabled, notificationsEnabled, language, toggleSound, toggleNotifications, setLanguage } = useSettingsStore();
    const { profile } = useProfileStore();
    const { t } = useTranslation();

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                    <ThemedText type="code" style={styles.backText}>{t('common.return')}</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle">{t('settings.title')}</ThemedText>
                <View style={{ width: 40 }} />
            </Animated.View>

            <Animated.ScrollView
                entering={FadeInUp.delay(200).duration(600)}
                style={styles.content}
                contentContainerStyle={{ gap: 30, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >

                {/* Profile Summary */}
                <View style={styles.section}>
                    <ThemedText type="code" style={styles.sectionTitle}>{t('settings.section_profile')}</ThemedText>
                    <View style={styles.profileCard}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                <Ionicons name={(profile?.avatar as any) || "person"} size={24} color="#FFF" />
                            </View>
                            <View>
                                <ThemedText type="default" style={styles.profileName}>{profile?.codename || t('common.unknown')}</ThemedText>
                                <ThemedText type="code" style={styles.profileId}>CODE AGENT : {profile?.id || '---'}</ThemedText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* System Settings */}
                <View style={styles.section}>
                    <ThemedText type="code" style={styles.sectionTitle}>{t('settings.section_device')}</ThemedText>

                    {/* Audio */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="volume-high-outline" size={20} color="#FFF" />
                            <ThemedText type="default">{t('settings.audio_fx')}</ThemedText>
                        </View>
                        <Switch
                            value={soundEnabled}
                            onValueChange={toggleSound}
                            trackColor={{ false: '#333', true: '#4ADE80' }}
                            thumbColor={'#FFF'}
                        />
                    </View>


                    {/* Notifications */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="notifications-outline" size={20} color="#FFF" />
                            <ThemedText type="default">{t('settings.notifications')}</ThemedText>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#333', true: '#4ADE80' }}
                            thumbColor={'#FFF'}
                        />
                    </View>

                    {/* Language */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name="language-outline" size={20} color="#FFF" />
                            <ThemedText type="default">{t('settings.language')}</ThemedText>
                        </View>
                        <View style={styles.langToggle}>
                            <TouchableOpacity
                                onPress={() => setLanguage('fr')}
                                style={[styles.langOption, language === 'fr' && styles.langActive]}
                            >
                                <ThemedText type="code" style={{ color: language === 'fr' ? '#000' : '#FFF', fontSize: 10 }}>FR</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLanguage('en')}
                                style={[styles.langOption, language === 'en' && styles.langActive]}
                            >
                                <ThemedText type="code" style={{ color: language === 'en' ? '#000' : '#FFF', fontSize: 10 }}>EN</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* System Info */}
                <View style={styles.section}>
                    <ThemedText type="code" style={styles.sectionTitle}>{t('settings.section_info')}</ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText type="code" style={styles.infoLabel}>{t('settings.version')}</ThemedText>
                        <ThemedText type="code" style={styles.infoValue}>v1.0.0 (BETA)</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="code" style={styles.infoLabel}>{t('settings.contact')}</ThemedText>
                        <ThemedText type="code" style={styles.infoValue}>otakumi.factory@gmail.com</ThemedText>
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
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    backText: {
        fontSize: 12,
        opacity: 0.7,
    },
    content: {
        flex: 1,
        gap: 30,
    },
    section: {
        gap: 15,
    },
    sectionTitle: {
        fontSize: 10,
        opacity: 0.5,
        marginBottom: 5,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 15,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    profileId: {
        fontSize: 10,
        opacity: 0.5,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    infoLabel: {
        opacity: 0.5,
    },
    infoValue: {
        opacity: 0.8,
    },
    footer: {
        paddingVertical: 20,
    },
    langToggle: {
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#1a1a1a',
        padding: 2,
        borderRadius: 4,
    },
    langOption: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 2,
    },
    langActive: {
        backgroundColor: '#FFF',
    },
});
