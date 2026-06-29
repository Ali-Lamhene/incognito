import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function RulesScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Ambient Dark Gradient Background */}
            <LinearGradient
                colors={['#000000', '#0D0D0D', '#000000']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Top Navigation Header */}
            <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.backButton} 
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Theme.colors.paper} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('rules.title')}</Text>
            </View>

            {/* Spy Icon and Divider Line */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Image
                    source={require('../../assets/UI/icon_mask.png')}
                    style={styles.dividerIcon}
                    tintColor={Theme.colors.paper}
                    contentFit="contain"
                />
                <View style={styles.dividerLine} />
            </View>

            <Animated.ScrollView
                entering={FadeInUp.delay(100).duration(600)}
                style={styles.scrollView}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: 16,
                    paddingBottom: insets.bottom + 120,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Graphic & Subtitle */}
                <View style={styles.heroRow}>
                    <Image
                        source={require('../../assets/UI/header_rules.png')}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                    <View style={styles.introTextContainer}>
                        <Text style={styles.introText}>
                            {t('rules.intro')}
                        </Text>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    {/* Card 1: VOTRE MISSION */}
                    <Animated.View 
                        entering={FadeInDown.delay(200).duration(500)} 
                        style={styles.ruleCard}
                    >
                        <View style={styles.cardLeft}>
                                <Image
                                    source={require('../../assets/UI/icon_target.png')}
                                    style={styles.cardIcon}
                                    tintColor={Theme.colors.red}
                                    contentFit="contain"
                                />
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.ruleCardTitle}>{t('rules.rule_1_title')}</Text>
                            <View style={styles.bulletList}>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_1_b1')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_1_b2')}</Text>
                                </View>
                                {/* <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>
                                        {t('rules.rule_1_b3_part1')}
                                        <Text style={styles.textRed}>{t('rules.rule_1_b3_part2')}</Text>.
                                    </Text>
                                </View> */}
                            </View>
                        </View>
                    </Animated.View>

                    {/* Card 2: RESTEZ INCOGNITO */}
                    <Animated.View 
                        entering={FadeInDown.delay(300).duration(500)} 
                        style={styles.ruleCard}
                    >
                        <View style={styles.cardLeft}>
                                <Image
                                    source={require('../../assets/UI/icon_mask.png')}
                                    style={styles.cardIcon}
                                    tintColor={Theme.colors.red}
                                    contentFit="contain"
                                />
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.ruleCardTitle}>{t('rules.rule_2_title')}</Text>
                            <View style={styles.bulletList}>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_2_b1')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_2_b2')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_2_b3')}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Card 3: DÉMASQUEZ LES SUSPECTS */}
                    <Animated.View 
                        entering={FadeInDown.delay(400).duration(500)} 
                        style={styles.ruleCard}
                    >
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/UI/icon_loupe.png')}
                                style={styles.cardIcon}
                                contentFit="contain"
                            />
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.ruleCardTitle}>{t('rules.rule_3_title')}</Text>
                            <View style={styles.bulletList}>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_3_b1')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_3_b2')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_3_b3')}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Card 4: COMMENT ACCUSER ? */}
                    <Animated.View 
                        entering={FadeInDown.delay(500).duration(500)} 
                        style={styles.ruleCard}
                    >
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/UI/icon_digit.png')}
                                style={styles.cardIcon}
                                contentFit="contain"
                            />
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.ruleCardTitle}>{t('rules.rule_4_title')}</Text>
                            <View style={styles.accuseFlow}>
                                <View style={styles.flowItem}>
                                    <View style={styles.flowIconContainer}>
                                        <Ionicons name="radio-button-on" size={20} color="rgba(242, 232, 207, 0.75)" />
                                    </View>
                                    <Text style={styles.flowText} numberOfLines={3} textBreakStrategy="simple">{t('rules.rule_4_step1')}</Text>
                                </View>
                                <View style={styles.flowArrow}>
                                    <Ionicons name="arrow-forward" size={12} color="rgba(242, 232, 207, 0.4)" />
                                </View>
                                <View style={styles.flowItem}>
                                    <View style={styles.flowIconContainer}>
                                        <Image source={require('../../assets/UI/icon_mask.png')} style={styles.flowIcon} tintColor="rgba(242, 232, 207, 0.75)" contentFit="contain" />
                                    </View>
                                    <Text style={styles.flowText} numberOfLines={3} textBreakStrategy="simple">{t('rules.rule_4_step2')}</Text>
                                </View>
                                <View style={styles.flowArrow}>
                                    <Ionicons name="arrow-forward" size={12} color="rgba(242, 232, 207, 0.4)" />
                                </View>
                                <View style={styles.flowItem}>
                                    <View style={styles.flowIconContainer}>
                                        <Ionicons name="chatbubble-ellipses" size={20} color="rgba(242, 232, 207, 0.75)" />
                                    </View>
                                    <Text style={styles.flowText} numberOfLines={3} textBreakStrategy="simple">{t('rules.rule_4_step3')}</Text>
                                </View>
                                <View style={styles.flowArrow}>
                                    <Ionicons name="arrow-forward" size={12} color="rgba(242, 232, 207, 0.4)" />
                                </View>
                                <View style={styles.flowItem}>
                                    <View style={styles.flowIconContainer}>
                                        <Ionicons name="clipboard" size={20} color="rgba(242, 232, 207, 0.75)" />
                                    </View>
                                    <Text style={styles.flowText} numberOfLines={3} textBreakStrategy="simple">{t('rules.rule_4_step4')}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Card 5: LE TRIBUNAL DES ESPIONS */}
                    <Animated.View 
                        entering={FadeInDown.delay(600).duration(500)} 
                        style={styles.ruleCard}
                    >
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/UI/icon_balance.png')}
                                style={styles.cardIcon}
                                contentFit="contain"
                            />
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.ruleCardTitle}>{t('rules.rule_5_title')}</Text>
                            <View style={styles.bulletList}>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{t('rules.rule_5_b1')}</Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>
                                        {t('rules.rule_5_b2_part1')}
                                        <Text style={styles.textGreen}>{t('rules.rule_5_b2_part2')}</Text>.
                                    </Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>
                                        {t('rules.rule_5_b3_part1')}
                                        <Text style={styles.textRed}>{t('rules.rule_5_b3_part2')}</Text>.
                                    </Text>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>
                                        {t('rules.rule_5_b4_part1')}
                                        <Text style={styles.textRed}>{t('rules.rule_5_b4_part2')}</Text>.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 5,
        zIndex: 10,
    },
    headerTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 38,
        color: Theme.colors.red,
        letterSpacing: 2,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        paddingHorizontal: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(242, 232, 207, 0.15)',
    },
    dividerIcon: {
        width: 16,
        height: 16,
        marginHorizontal: 12,
    },
    scrollView: {
        flex: 1,
    },
    heroRow: {
        width: '100%',
        height: 160,
        position: 'relative',
        marginBottom: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    introTextContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        width: '38%',
    },
    introText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#F2E8CF',
        lineHeight: 16,
        textAlign: 'left',
    },
    highlightRed: {
        color: Theme.colors.red,
        fontFamily: 'Montserrat-SemiBold',
    },
    mainContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    ruleCard: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.totalBlack,
        borderWidth: 1,
        borderColor: 'rgba(242, 232, 207, 0.08)',
        borderRadius: 8,
        padding: 12,
        overflow: 'hidden',
    },
    cardLeft: {
        width: 56,
        height: 56,
        borderRadius: 6,
        backgroundColor: 'rgba(139, 30, 30, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 12,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: Theme.colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 30, 30, 0.03)',
    },
    cardIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    cardRight: {
        flex: 1,
    },
    ruleCardTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: '#F2E8CF',
        letterSpacing: 1.5,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    bulletList: {
        gap: 6,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: Theme.colors.red,
        marginRight: 8,
        marginTop: 5,
    },
    bulletText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 8,
        color: 'rgba(242, 232, 207, 0.75)',
        lineHeight: 15,
        flex: 1,
    },
    textRed: {
        color: Theme.colors.red,
        fontFamily: 'Montserrat-SemiBold',
    },
    textGreen: {
        color: '#2E7D32',
        fontFamily: 'Montserrat-SemiBold',
    },
    quoteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
        borderWidth: 1,
        borderColor: 'rgba(139, 30, 30, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 5,
    },
    quoteIconLeft: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 32,
        color: Theme.colors.red,
        marginRight: 10,
        bottom: 5,
    },
    quoteText: {
        fontFamily: 'Montserrat-Regular',
        fontStyle: 'italic',
        fontSize: 12.5,
        color: Theme.colors.red,
        flex: 1,
        lineHeight: 17,
        textAlign: 'center',
    },
    quoteIconRight: {
        width: 22,
        height: 22,
        marginLeft: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.colors.red,
        borderRadius: 8,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(242, 232, 207, 0.12)',
        marginTop: 5,
    },
    buttonIcon: {
        width: 22,
        height: 22,
        marginRight: 10,
    },
    actionButtonText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 22,
        color: '#FFFFFF',
        letterSpacing: 1.5,
    },
    
    // Accuse flow styling (for card 4 when uncommented)
    accuseFlow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    flowItem: {
        alignItems: 'center',
        width: '20%',
    },
    flowIconContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    flowIcon: {
        width: 18,
        height: 18,
    },
    flowText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 7,
        color: 'rgba(242, 232, 207, 0.6)',
        textAlign: 'center',
        lineHeight: 9,
        width: 50,
    },
    flowArrow: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

