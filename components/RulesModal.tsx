import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { MainButton } from './MainButton';
import { ThemedText } from './ThemedText';

interface RulesModalProps {
    visible: boolean;
    onClose: () => void;
}

export function RulesModal({ visible, onClose }: RulesModalProps) {
    const { t } = useTranslation();

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.backdrop}
                    />

                    <TouchableWithoutFeedback>
                        <Animated.View
                            entering={ZoomIn.duration(300)}
                            exiting={ZoomOut.duration(200)}
                            style={[styles.container, { borderColor: '#FFF' }]}
                        >
                            <View style={styles.header}>
                                <ThemedText type="subtitle" style={styles.title}>
                                    {t('rules.title')}
                                </ThemedText>
                                <View style={[styles.line, { backgroundColor: '#FFF' }]} />
                            </View>

                            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                                <ThemedText type="code" style={styles.intro}>
                                    {t('rules.intro')}
                                </ThemedText>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_1_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_1_text')}</ThemedText>
                                </View>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_2_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_2_text')}</ThemedText>
                                </View>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_3_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_3_text')}</ThemedText>
                                </View>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_4_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_4_text')}</ThemedText>
                                </View>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_5_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_5_text')}</ThemedText>
                                </View>

                                <View style={styles.ruleItem}>
                                    <ThemedText type="subtitle" style={styles.ruleTitle}>{t('rules.rule_6_title')}</ThemedText>
                                    <ThemedText type="default" style={styles.ruleText}>{t('rules.rule_6_text')}</ThemedText>
                                </View>

                                <ThemedText type="code" style={styles.footerText}>
                                    {t('rules.footer')}
                                </ThemedText>
                            </ScrollView>

                            <MainButton
                                title={t('common.ok')}
                                onPress={onClose}
                                style={[styles.button, { backgroundColor: '#FFF' }]}
                                textStyle={{ color: '#000', fontSize: 12 }}
                            />

                            {/* Decoration */}
                            <View style={styles.cornerTL} />
                            <View style={styles.cornerBR} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    container: {
        width: '90%',
        maxWidth: 600,
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        padding: 25,
        gap: 20,
    },
    header: {
        gap: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        letterSpacing: 2,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    line: {
        height: 2,
        width: 40,
        borderRadius: 1,
    },
    content: {
        maxHeight: 450,
    },
    intro: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 20,
        lineHeight: 18,
    },
    ruleItem: {
        marginBottom: 20,
        gap: 5,
    },
    ruleTitle: {
        fontSize: 14,
        letterSpacing: 1,
        color: '#FFF',
    },
    ruleText: {
        fontSize: 13,
        opacity: 0.6,
        lineHeight: 20,
    },
    footerText: {
        fontSize: 11,
        opacity: 0.4,
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    button: {
        marginTop: 10,
        height: 50,
    },
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
});
