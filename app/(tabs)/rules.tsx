import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

export default function RulesScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                <Text style={styles.headerTitle}>{t('rules.title')}</Text>
            </Animated.View>

            <Animated.ScrollView
                entering={FadeInUp.delay(200).duration(600)}
                style={styles.content}
                contentContainerStyle={{ gap: 25, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.intro}>
                    {t('rules.intro')}
                </Text>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>01. {t('rules.rule_1_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_1_text')}</Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>02. {t('rules.rule_2_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_2_text')}</Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>03. {t('rules.rule_3_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_3_text')}</Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>04. {t('rules.rule_4_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_4_text')}</Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>05. {t('rules.rule_5_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_5_text')}</Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text style={styles.ruleTitle}>06. {t('rules.rule_6_title')}</Text>
                    <Text style={styles.ruleText}>{t('rules.rule_6_text')}</Text>
                </View>

                <Text style={styles.footerText}>
                    {t('rules.footer')}
                </Text>
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
    intro: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: 'rgba(242, 232, 207, 0.8)',
        lineHeight: 24,
        marginBottom: 10,
        letterSpacing: 0.8,
    },
    ruleItem: {
        gap: 8,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    ruleTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: '#F2E8CF',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    ruleText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 22,
        letterSpacing: 0.8,
    },
    footerText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 15,
        lineHeight: 20,
        letterSpacing: 0.8,
    },
});
