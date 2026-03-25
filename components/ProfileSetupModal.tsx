import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { useSettingsStore } from '../store/settingsStore';
import { MainButton } from './MainButton';
import { ThemedText } from './ThemedText';

interface ProfileSetupModalProps {
    visible: boolean;
    onComplete: (codename: string, avatar: string, color: string) => void;
    initialData?: { codename: string; avatar: string; color: string };
}

const AGENT_EMBLEMS = [
    'shield-checkmark-outline', 'finger-print-outline', 'eye-outline', 'skull-outline', 'flash-outline',
    'radio-outline', 'locate-outline', 'briefcase-outline', 'bug-outline', 'lock-closed-outline',
    'key-outline', 'rocket-outline', 'planet-outline', 'code-slash-outline', 'nuclear-outline'
];
const AGENT_COLORS = ['#0D9488', '#F43F5E', '#3B82F6', '#EAB308', '#8B5CF6', '#10B981'];

export function ProfileSetupModal({ visible, onComplete, initialData }: ProfileSetupModalProps) {
    const [codename, setCodename] = useState(initialData?.codename || '');
    const [selectedEmblem, setSelectedEmblem] = useState(initialData?.avatar || AGENT_EMBLEMS[0]);
    const [selectedColor, setSelectedColor] = useState(initialData?.color || AGENT_COLORS[0]);
    const { t } = useTranslation();
    const { soundEnabled, language, toggleSound, setLanguage } = useSettingsStore();

    // Reset state when visible or initialData changes
    React.useEffect(() => {
        if (visible) {
            setCodename(initialData?.codename || '');
            setSelectedEmblem(initialData?.avatar || AGENT_EMBLEMS[0]);
            setSelectedColor(initialData?.color || AGENT_COLORS[0]);
        }
    }, [visible, initialData]);

    const handleConfirm = () => {
        if (codename.trim().length > 0) {
            onComplete(codename.trim(), selectedEmblem, selectedColor);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback>
                <View style={styles.overlay}>
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.backdrop}
                    />

                    <Animated.View
                        entering={ZoomIn.duration(300)}
                        exiting={ZoomOut.duration(200)}
                        style={[styles.container, { borderColor: '#FFF' }]}
                    >
                        <View style={styles.header}>
                            <ThemedText type="subtitle" style={styles.title}>
                                {initialData ? t('profile.title_edit') : t('profile.title_new')}
                            </ThemedText>
                            <View style={[styles.line, { backgroundColor: '#FFF' }]} />
                        </View>

                        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <ThemedText type="code" style={styles.label}>{t('profile.label_codename')}</ThemedText>
                                <TextInput
                                    style={[styles.input, { borderColor: '#FFF' }]}
                                    placeholder={t('profile.placeholder_codename')}
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={codename}
                                    onChangeText={setCodename}
                                    maxLength={12}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText type="code" style={styles.label}>{t('profile.label_emblem')}</ThemedText>
                                <View style={styles.emblemGrid}>
                                    {AGENT_EMBLEMS.map((icon) => (
                                        <TouchableOpacity
                                            key={icon}
                                            onPress={() => setSelectedEmblem(icon)}
                                            style={[
                                                styles.emblemOption,
                                                selectedEmblem === icon && { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#FFF' }
                                            ]}
                                        >
                                            <Ionicons
                                                name={icon as any}
                                                size={24}
                                                color={selectedEmblem === icon ? '#FFF' : '#666'}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* New Settings Section */}
                            <View style={styles.settingsSection}>
                                <ThemedText type="code" style={styles.label}>{t('settings.section_device')}</ThemedText>
                                
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLabel}>
                                        <Ionicons name="volume-high-outline" size={16} color="#FFF" />
                                        <ThemedText type="code" style={styles.settingText}>{t('settings.audio_fx')}</ThemedText>
                                    </View>
                                    <Switch
                                        value={soundEnabled}
                                        onValueChange={toggleSound}
                                        trackColor={{ false: '#333', true: '#FFF' }}
                                        thumbColor={soundEnabled ? '#000' : '#FFF'}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </View>

                                <View style={styles.settingRow}>
                                    <View style={styles.settingLabel}>
                                        <Ionicons name="language-outline" size={16} color="#FFF" />
                                        <ThemedText type="code" style={styles.settingText}>{t('settings.language')}</ThemedText>
                                    </View>
                                    <View style={styles.langToggle}>
                                        <TouchableOpacity
                                            onPress={() => setLanguage('fr')}
                                            style={[styles.langOption, language === 'fr' && styles.langActive]}
                                        >
                                            <ThemedText type="code" style={[styles.langText, { color: language === 'fr' ? '#000' : '#FFF' }]}>FR</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setLanguage('en')}
                                            style={[styles.langOption, language === 'en' && styles.langActive]}
                                        >
                                            <ThemedText type="code" style={[styles.langText, { color: language === 'en' ? '#000' : '#FFF' }]}>EN</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        <MainButton
                            title={initialData ? t('common.confirm') : t('profile.btn_create')}
                            onPress={handleConfirm}
                            style={[styles.button, { backgroundColor: '#FFF' }]}
                            textStyle={{ color: '#000', fontSize: 12 }}
                        />

                        {/* Decoration */}
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerBR} />
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        width: '100%',
        height: '100%',
    },
    container: {
        width: '85%',
        maxWidth: 600,
        marginHorizontal: 'auto',
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        padding: 25,
        gap: 25,
    },
    header: {
        gap: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        letterSpacing: 4,
        textAlign: 'center',
    },
    line: {
        height: 2,
        width: 40,
        borderRadius: 1,
    },
    formContainer: {
        maxHeight: 400,
    },
    inputGroup: {
        gap: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        opacity: 0.6,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        padding: 12,
        color: '#FFF',
        fontFamily: 'Courier', // Fallback
        fontSize: 16,
        letterSpacing: 2,
        textAlign: 'center',
    },
    emblemGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12, // More gap
        justifyContent: 'center',
    },
    emblemOption: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    colorOption: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#FFF',
        transform: [{ scale: 1.2 }],
    },
    button: {
        marginTop: 10,
        borderWidth: 0,
        height: 50,
    },
    settingsSection: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        gap: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    settingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingText: {
        fontSize: 10,
        opacity: 0.8,
    },
    langToggle: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 2,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    langOption: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 1,
    },
    langActive: {
        backgroundColor: '#FFF',
    },
    langText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
});
