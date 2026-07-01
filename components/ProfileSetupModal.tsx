import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    ScrollView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    View, 
    Text,
    useWindowDimensions
} from 'react-native';
import Animated, { 
    FadeIn, 
    FadeOut, 
    ZoomIn, 
    ZoomOut,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useSettingsStore } from '../store/settingsStore';
import { Theme } from '../constants/Theme';
import { Button } from './ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileSetupModalProps {
    visible: boolean;
    onComplete: (codename: string, avatar: string, color: string) => void;
    initialData?: { codename: string; avatar: string; color: string };
    modal?: boolean;
    onClose?: () => void;
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
            ['#1A1A1A', Theme.colors.red]
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

export function ProfileSetupModal({ visible, onComplete, initialData, modal = true, onClose }: ProfileSetupModalProps) {
    const [codename, setCodename] = useState(initialData?.codename || '');
    
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    
    const { 
        language, 
        setLanguage, 
        hapticsEnabled, 
        toggleHaptics 
    } = useSettingsStore();

    // Reset state when visible or initialData changes
    useEffect(() => {
        if (visible) {
            setCodename(initialData?.codename || '');
        }
    }, [visible, initialData]);

    const handleConfirm = () => {
        if (codename.trim().length > 0) {
            onComplete(
                codename.trim(), 
                initialData?.avatar || 'finger-print-outline', 
                initialData?.color || '#8B1E1E'
            );
        }
    };

    if (!visible) return null;

    // Calculate dimensions based on screen width
    const logoWidth = screenWidth - 40;
    const logoHeight = logoWidth / 3.257;
    const coverImageHeight = screenWidth / 2.048; // Natural aspect ratio height

    if (!modal) {
        return (
            <View style={[styles.fullscreenContainer, { paddingTop: insets.top }]}>
                {/* Background Image Texture */}
                <Image 
                    source={require('../assets/UI/texture_city_dark.png')} 
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.04 }]}
                    contentFit="cover"
                />

                <ScrollView 
                    style={styles.scrollContainer} 
                    contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cover Header Image Wrapper (contains cover image shifted down and absolute logo) */}
                    <View style={[styles.coverWrapper, { height: coverImageHeight + 110 }]}>
                        <Image 
                            source={require('../assets/UI/header_init.png')} 
                            style={[styles.coverImage, { height: coverImageHeight }]}
                            contentFit="contain"
                        />
                        {/* Top Fade Gradient to blend the top edge of the illustration */}
                        <LinearGradient
                            colors={['#000000', 'rgba(0, 0, 0, 0.4)', 'transparent']}
                            style={[styles.topGradient, { top: 100 }]}
                        />
                        {/* Deep Bottom Fade Gradient */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.95)', '#000000']}
                            style={styles.bottomGradient}
                        />
                        {/* Logo overlay at the top (absolute, matches inputs width) */}
                        <View style={[styles.logoOverlayContainer, { width: logoWidth, height: logoHeight }]}>
                            <Image 
                                source={require('../assets/UI/incognito_logo.png')} 
                                style={StyleSheet.absoluteFillObject}
                                contentFit="contain"
                            />
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Title */}
                        <Text style={styles.mainTitle}>{t('profile.title_new')}</Text>
                        
                        {/* Separator with sparkles/star and fading gradient lines */}
                        <View style={styles.separatorContainer}>
                            <LinearGradient
                                colors={['transparent', 'rgba(139, 30, 30, 0.4)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.separatorLine}
                            />
                            <Ionicons name="star" size={8} color={Theme.colors.red} style={{ marginHorizontal: 8 }} />
                            <LinearGradient
                                colors={['rgba(139, 30, 30, 0.4)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.separatorLine}
                            />
                        </View>

                        {/* Welcome Text */}
                        <Text style={styles.welcomeText}>
                            {t('profile.subtitle_new')}
                        </Text>

                        {/* SECTION 1: TON PSEUDO */}
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-outline" size={18} color={Theme.colors.red} />
                            <Text style={styles.sectionTitle}>{t('profile.label_codename')}</Text>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={18} color="rgba(242, 232, 207, 0.4)" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.inputField}
                                placeholder={t('profile.placeholder_codename')}
                                placeholderTextColor="rgba(242, 232, 207, 0.25)"
                                value={codename}
                                onChangeText={setCodename}
                                maxLength={12}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>
                        <Text style={styles.inputSubtext}>
                            {t('profile.input_subtext')}
                        </Text>

                        {/* SECTION 2: TES PRÉFÉRENCES */}
                        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
                            <Ionicons name="settings-outline" size={18} color={Theme.colors.red} />
                            <Text style={styles.sectionTitle}>{t('profile.label_preferences')}</Text>
                        </View>

                        <View style={styles.preferencesList}>
                            {/* Haptics */}
                            <View style={styles.preferenceRow}>
                                <View style={styles.preferenceInfo}>
                                    <Text style={styles.preferenceLabel}>{t('profile.haptics_label')}</Text>
                                    <Text style={styles.preferenceDesc}>{t('profile.haptics_desc')}</Text>
                                </View>
                                <CustomSwitch
                                    value={hapticsEnabled}
                                    onValueChange={toggleHaptics}
                                />
                            </View>

                            {/* Language */}
                            <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
                                <View style={styles.preferenceInfo}>
                                    <Text style={styles.preferenceLabel}>{t('profile.lang_label')}</Text>
                                    <Text style={styles.preferenceDesc}>{t('profile.lang_desc')}</Text>
                                </View>
                                <View style={styles.langToggle}>
                                    <TouchableOpacity
                                        onPress={() => setLanguage('fr')}
                                        style={[styles.langOption, language === 'fr' && styles.langActive]}
                                    >
                                        <Text style={[styles.langText, { color: language === 'fr' ? Theme.colors.text.dark : Theme.colors.text.light }]}>FR</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setLanguage('en')}
                                        style={[styles.langOption, language === 'en' && styles.langActive]}
                                    >
                                        <Text style={[styles.langText, { color: language === 'en' ? Theme.colors.text.dark : Theme.colors.text.light }]}>EN</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, codename.trim().length === 0 && styles.submitButtonDisabled]}
                            onPress={handleConfirm}
                            disabled={codename.trim().length === 0}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="compass-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.submitButtonText}>{t('profile.btn_create')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Modal Mode for Editing profile later
    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback>
                <View style={styles.modalOverlay}>
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.modalBackdrop}
                    />

                    <Animated.View
                        entering={ZoomIn.duration(300)}
                        exiting={ZoomOut.duration(200)}
                        style={styles.modalContainer}
                    >
                        <View style={styles.cardWrapper}>
                            {/* Card Texture */}
                            <Image 
                                source={require('../assets/UI/texture_city_dark.png')} 
                                style={[StyleSheet.absoluteFillObject, { opacity: 0.08, borderRadius: 8 }]}
                                contentFit="cover"
                            />
                            {/* Header section inside the card */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>
                                    {t('profile.title_edit') || "EDITION DU PROFIL"}
                                </Text>
                                <View style={styles.headerLine} />
                                
                                {onClose && (
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color={Theme.colors.text.light} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={[styles.sectionHeader, { marginBottom: 12 }]}>
                                <Ionicons name="person-outline" size={16} color={Theme.colors.red} />
                                <Text style={styles.sectionTitle}>{t('profile.edit_codename_label')}</Text>
                            </View>

                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={18} color="rgba(242, 232, 207, 0.4)" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.inputField}
                                    placeholder={t('profile.placeholder_codename')}
                                    placeholderTextColor="rgba(242, 232, 207, 0.25)"
                                    value={codename}
                                    onChangeText={setCodename}
                                    maxLength={12}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />
                            </View>

                            <Button
                                title={t('common.confirm') || "CONFIRMER"}
                                onPress={handleConfirm}
                                disabled={codename.trim().length === 0}
                                style={{ marginTop: 20 }}
                                variant="primary"
                            />
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        flex: 1,
    },
    coverWrapper: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#000000',
    },
    coverImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    logoOverlayContainer: {
        position: 'absolute',
        top: 25,
        left: 20,
        zIndex: 3,
    },
    topGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 30,
        zIndex: 2,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 2,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    mainTitle: {
        fontFamily: Theme.fonts.title,
        fontSize: 28,
        color: Theme.colors.red,
        textAlign: 'center',
        letterSpacing: 2,
        marginTop: 5,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    separatorLine: {
        width: 80,
        height: 1,
    },
    welcomeText: {
        fontFamily: Theme.fonts.body,
        fontSize: 11,
        color: Theme.colors.text.light,
        opacity: 0.75,
        textAlign: 'center',
        lineHeight: 15,
        paddingHorizontal: 10,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontFamily: Theme.fonts.title,
        fontSize: 16,
        color: Theme.colors.red,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
        borderWidth: 1,
        borderColor: 'rgba(242, 232, 207, 0.15)',
        borderRadius: 6,
        paddingHorizontal: 12,
    },
    inputField: {
        flex: 1,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.body,
        fontSize: 14,
        paddingVertical: 12,
    },
    inputSubtext: {
        fontFamily: Theme.fonts.body,
        fontSize: 11,
        color: Theme.colors.text.muted,
        marginTop: 6,
        paddingLeft: 4,
    },
    preferencesList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(242, 232, 207, 0.1)',
    },
    preferenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(242, 232, 207, 0.1)',
    },
    preferenceInfo: {
        flex: 1,
        marginRight: 10,
    },
    preferenceLabel: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 14,
        color: Theme.colors.text.light,
        letterSpacing: 0.5,
    },
    preferenceDesc: {
        fontFamily: Theme.fonts.body,
        fontSize: 11,
        color: Theme.colors.text.muted,
        marginTop: 3,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.colors.red,
        borderRadius: 6,
        paddingVertical: 15,
        marginTop: 35,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontFamily: Theme.fonts.title,
        fontSize: 18,
        color: '#FFF',
        letterSpacing: 1.5,
    },
    langToggle: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: '#0F0F0F',
        padding: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(242, 232, 207, 0.15)',
    },
    langOption: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    langActive: {
        backgroundColor: Theme.colors.text.light,
    },
    langText: {
        fontFamily: Theme.fonts.title,
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
        borderColor: 'rgba(242, 232, 207, 0.15)',
    },
    switchThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Theme.colors.text.light,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 420,
        backgroundColor: 'transparent',
    },
    cardWrapper: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        borderWidth: 1.5,
        borderColor: 'rgba(242, 232, 207, 0.12)',
        borderRadius: 8,
        padding: 20,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
    },
    cardTitle: {
        fontFamily: Theme.fonts.title,
        fontSize: 16,
        color: Theme.colors.red,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    headerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(242, 232, 207, 0.15)',
        marginLeft: 10,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 4,
    },
});
