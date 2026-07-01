import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import Animated, { 
    FadeInDown, 
    FadeInUp, 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    interpolateColor 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../../store/profileStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppState } from '../../store/appState';
import { useTranslation } from '../../hooks/useTranslation';
import { Theme } from '../../constants/Theme';
import { ProfileSetupModal } from '../../components/ProfileSetupModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { useSession } from '../../context/SessionContext';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { hapticsEnabled, language, toggleHaptics, setLanguage } = useSettingsStore();
    const { clearSession } = useSession();
    const { profile, updateProfile, resetProfile } = useProfileStore();
    const { t } = useTranslation();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const setShowGlobalProfileModal = useAppState((state) => state.setShowProfileModal);

    const handleResetAll = () => {
        Alert.alert(
            "Réinitialisation",
            "Voulez-vous vraiment supprimer toutes les informations de l'agent et réinitialiser l'application ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Réinitialiser", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearSession();
                        } catch (e) {
                            console.log("No active session to clear", e);
                        }
                        resetProfile();
                        setShowGlobalProfileModal(true);
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const handleProfileComplete = (codename: string, avatar: string, color: string) => {
        updateProfile({ codename, avatar, themeColor: color });
        setShowProfileModal(false);
    };

    const renderSectionHeader = (title: string) => (
        <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionHeaderLineShort} />
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionHeaderLineLong} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom - 20}]}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600)}>
                <PageHeader
                    title={t('settings.title')}
                    showBack={false}
                    showSeparator={true}
                />
            </Animated.View>

            <Animated.ScrollView
                entering={FadeInUp.delay(200).duration(600)}
                style={styles.content}
                contentContainerStyle={{ gap: 15, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Summary */}
                <View style={styles.section}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowProfileModal(true)}
                        style={styles.profileCard}
                    >
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={require('../../assets/UI/visual_icon.png')}
                                    style={styles.avatarImage}
                                    contentFit="cover"
                                />
                            </View>
                            <View style={styles.profileMeta}>
                                <Text style={styles.profileName}>{profile?.codename || 'ALPHA'}</Text>
                                <Text style={styles.profileId}>
                                    {t('settings.agent_code')}{profile?.id ? profile.id.replace('AGENT-', '') : 'X7K9'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#F2E8CF" style={styles.chevron} />
                    </TouchableOpacity>
                </View>

                {/* System Settings */}
                <View style={styles.section}>
                    {renderSectionHeader(t('settings.section_device'))}

                    <View style={styles.cardContainer}>
                        {/* Haptics */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabel}>
                                <Ionicons name="pulse" size={22} color="#F2E8CF" />
                                <Text style={styles.settingText}>{t('settings.haptics') || 'Vibrations (Mode Furtif)'}</Text>
                            </View>
                            <CustomSwitch
                                value={hapticsEnabled}
                                onValueChange={toggleHaptics}
                            />
                        </View>

                        {/* Language */}
                        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.settingLabel}>
                                <Ionicons name="globe-outline" size={22} color="#F2E8CF" />
                                <Text style={styles.settingText}>{t('settings.language')}</Text>
                            </View>
                            <View style={styles.langToggle}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setLanguage('fr')}
                                    style={[styles.langOption, language === 'fr' && styles.langActive]}
                                >
                                    <Text style={[styles.langText, { color: language === 'fr' ? '#000' : '#F2E8CF' }]}>FR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setLanguage('en')}
                                    style={[styles.langOption, language === 'en' && styles.langActive]}
                                >
                                    <Text style={[styles.langText, { color: language === 'en' ? '#000' : '#F2E8CF' }]}>EN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* System Info */}
                <View style={styles.section}>
                    {renderSectionHeader(t('settings.section_info'))}

                    <View style={styles.cardContainer}>
                        {/* Version */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Ionicons name="information-circle-outline" size={22} color="#F2E8CF" />
                                <Text style={styles.infoLabel}>{t('settings.version')}</Text>
                            </View>
                            <View style={styles.infoRight}>
                                <Text style={styles.infoValue}>v1.0.0 (BETA)</Text>
                            </View>
                        </View>

                        {/* Contact */}
                        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.infoLeft}>
                                <Ionicons name="mail-outline" size={22} color="#F2E8CF" />
                                <Text style={styles.infoLabel}>{t('settings.contact')}</Text>
                            </View>
                            <View style={styles.infoRight}>
                                <Text style={styles.infoValue}>otakumi.factory@gmail.com</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dev Tools (Provisoire) */}
                <View style={styles.section}>
                    {renderSectionHeader("DÉVELOPPEMENT (PROVISOIRE)")}

                    <View style={styles.cardContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleResetAll}
                            style={[styles.settingRow, { borderBottomWidth: 0 }]}
                        >
                            <View style={styles.settingLabel}>
                                <Ionicons name="trash-outline" size={22} color={Theme.colors.status.alert} />
                                <Text style={[styles.settingText, { color: Theme.colors.status.alert }]}>
                                    Réinitialiser l'Agent (Reset)
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Theme.colors.status.alert} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>

            <ProfileSetupModal
                visible={showProfileModal}
                onComplete={handleProfileComplete}
                onClose={() => setShowProfileModal(false)}
                initialData={profile ? { codename: profile.codename, avatar: profile.avatar, color: profile.themeColor } : undefined}
            />
        </View>
    );
}

interface CustomSwitchProps {
    value: boolean;
    onValueChange: () => void;
}

function CustomSwitch({ value, onValueChange }: CustomSwitchProps) {
    const progress = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
        progress.value = withTiming(value ? 1 : 0, { duration: 200 });
    }, [value]);

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#070707', Theme.colors.red]
        );
        return { backgroundColor };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const translateX = progress.value * 20;
        return {
            transform: [{ translateX }]
        };
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onValueChange}
        >
            <Animated.View style={[styles.switchTrack, trackAnimatedStyle]}>
                <Animated.View style={[styles.switchThumb, thumbAnimatedStyle]} />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 10,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionHeaderLineShort: {
        width: 8,
        height: 1,
        backgroundColor: 'rgba(242, 232, 207, 0.15)',
        marginRight: 8,
    },
    sectionTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 16,
        color: 'rgba(242, 232, 207, 0.5)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    sectionHeaderLineLong: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(242, 232, 207, 0.15)',
        marginLeft: 8,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Theme.colors.backgroundLighter,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginTop: 15,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 2,
        borderColor: Theme.colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        marginRight: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        transform: [{ scale: 2.6 }, { translateY: 4 }],
    },
    profileMeta: {
        justifyContent: 'center',
        gap: 2,
    },
    profileName: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 24,
        color: '#FFF',
        letterSpacing: 1.5,
    },
    profileId: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 2,
    },
    chevron: {
        opacity: 0.7,
    },
    cardContainer: {
        backgroundColor: Theme.colors.backgroundLighter,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    settingText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#F2E8CF',
        letterSpacing: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoLabel: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#F2E8CF',
        letterSpacing: 1,
    },
    infoRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoValue: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    langToggle: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: '#0F0F0F',
        padding: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    langOption: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    langActive: {
        backgroundColor: '#F2E8CF',
    },
    langText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    switchTrack: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    switchThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F2E8CF',
    },
});
