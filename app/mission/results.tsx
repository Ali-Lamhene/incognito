import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainButton } from "../../components/MainButton";
import { ThemedText } from "../../components/ThemedText";
import { useSession } from "../../context/SessionContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useProfileStore } from "../../store/profileStore";

export default function ResultsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { agents, session, clearSession } = useSession();
    const { profile } = useProfileStore();
    const { t } = useTranslation();

    const [frozenAgents] = React.useState([...agents]);
    const sortedAgents = [...frozenAgents].sort((a, b) => (b.score || 0) - (a.score || 0));
    const isHost = session?.role === 'HOST';

    const handleBackHome = async () => {
        await clearSession(profile?.id);
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            {/* Background Layers */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require("../../assets/images/agent_silhouette_rain.png")}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
                <View style={styles.backgroundOverlay} />
            </View>

            {/* CONFIDENTIAL Watermark */}
            <View style={styles.watermarkContainer} pointerEvents="none">
                <ThemedText type="futuristic" style={styles.watermarkText}>CONFIDENTIAL</ThemedText>
            </View>

            <ScrollView
                style={{ flex: 1, marginBottom: insets.bottom }}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.statusDot} />
                        <ThemedText type="code" style={styles.missionLabel}>
                            MISSION_REPORT // {session?.code}
                        </ThemedText>
                    </View>
                    <ThemedText type="futuristic" style={styles.screenTitle}>
                        FINAL DEBRIEF
                    </ThemedText>
                    <View style={styles.headerLineContainer}>
                        <View style={styles.headerLine} />
                        <View style={[styles.headerLine, { width: 10, opacity: 0.8 }]} />
                        <View style={[styles.headerLine, { width: 5, opacity: 0.5 }]} />
                    </View>
                </Animated.View>

                {/* Summary Stats Card */}
                <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <ThemedText type="code" style={styles.statLabel}>AGENTS_DEPLOYED</ThemedText>
                        <ThemedText type="futuristic" style={styles.statValue}>{agents.length}</ThemedText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <ThemedText type="code" style={styles.statLabel}>THREAT_LEVEL</ThemedText>
                        <ThemedText type="futuristic" style={[styles.statValue, { color: '#FF6B6B' }]}>
                            {session?.threatLevel === 'DOUBLE_ZERO' ? 'MAX' : session?.threatLevel || 'AGENT'}
                        </ThemedText>
                    </View>
                </Animated.View>

                {/* Podium Section */}
                <View style={styles.podiumContainer}>
                    {/* 2nd Place */}
                    {sortedAgents[1] && (
                        <Animated.View
                            entering={FadeInUp.delay(500).duration(800)}
                            style={[styles.podiumPlace, styles.secondPlace]}
                        >
                            <View style={styles.rankBadgeSmall}>
                                <ThemedText type="code" style={styles.rankTextSmall}>02</ThemedText>
                            </View>
                            <Ionicons name={sortedAgents[1].avatar as any || "person"} size={24} color="rgba(255,255,255,0.6)" />
                            <ThemedText type="code" numberOfLines={1} style={styles.podiumName}>{sortedAgents[1].name}</ThemedText>
                            <ThemedText type="futuristic" style={styles.podiumScore}>{sortedAgents[1].score || 0}</ThemedText>
                        </Animated.View>
                    )}

                    {/* 1st Place / MVP */}
                    {sortedAgents[0] && (
                        <Animated.View
                            entering={FadeInUp.delay(400).duration(1000)}
                            style={[styles.podiumPlace, styles.firstPlace]}
                        >
                            <View style={styles.mvpBadge}>
                                <ThemedText type="code" style={styles.mvpText}>MVP</ThemedText>
                            </View>
                            <View style={styles.mvpGlow} />
                            <Ionicons name={sortedAgents[0].avatar as any || "person"} size={44} color="#FFF" />
                            <ThemedText type="code" numberOfLines={1} style={[styles.podiumName, { fontWeight: 'bold', fontSize: 10 }]}>
                                {sortedAgents[0].name.toUpperCase()}
                            </ThemedText>
                            <ThemedText type="futuristic" style={styles.firstPlaceScore}>{sortedAgents[0].score || 0}</ThemedText>
                            <ThemedText type="code" style={styles.creditsLabel}>CREDITS</ThemedText>
                        </Animated.View>
                    )}

                    {/* 3rd Place */}
                    {sortedAgents[2] && (
                        <Animated.View
                            entering={FadeInUp.delay(600).duration(800)}
                            style={[styles.podiumPlace, styles.thirdPlace]}
                        >
                            <View style={styles.rankBadgeSmall}>
                                <ThemedText type="code" style={styles.rankTextSmall}>03</ThemedText>
                            </View>
                            <Ionicons name={sortedAgents[2].avatar as any || "person"} size={20} color="rgba(255,255,255,0.4)" />
                            <ThemedText type="code" numberOfLines={1} style={styles.podiumName}>{sortedAgents[2].name}</ThemedText>
                            <ThemedText type="futuristic" style={styles.podiumScore}>{sortedAgents[2].score || 0}</ThemedText>
                        </Animated.View>
                    )}
                </View>

                {/* Agents Table List */}
                <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <ThemedText type="code" style={styles.tableHeaderLabel}>OPERATIONAL_UNIT</ThemedText>
                        <ThemedText type="code" style={styles.tableHeaderLabel}>STATUS</ThemedText>
                        <ThemedText type="code" style={styles.tableHeaderLabel}>RANK_PTS</ThemedText>
                    </View>

                    {sortedAgents.map((agent, index) => (
                        <Animated.View
                            key={agent.id}
                            entering={FadeInLeft.delay(900 + index * 50)}
                            style={[
                                styles.agentRow,
                                agent.id === profile?.id && styles.myRow
                            ]}
                        >
                            <View style={styles.rowMainInfo}>
                                <ThemedText type="code" style={styles.rowRank}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</ThemedText>
                                <ThemedText type="code" style={styles.rowAgentName}>{agent.name}</ThemedText>
                            </View>

                            <View style={styles.rowStatusBox}>
                                <View style={[styles.statusIndicator, (agent.score || 0) > 0 ? styles.statusPositive : styles.statusNegative]} />
                                <ThemedText type="code" style={styles.statusLabelSmall}>
                                    {(agent.score || 0) > 0 ? 'CLEARED' : 'SUSPICIOUS'}
                                </ThemedText>
                            </View>

                            <ThemedText type="futuristic" style={styles.rowScoreValue}>{agent.score || 0}</ThemedText>
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* Footer Action */}
                <Animated.View entering={FadeInUp.delay(1200).duration(600)} style={styles.footer}>
                    <MainButton
                        title="RETOURNER AU QUARTIER GÉNÉRAL"
                        onPress={handleBackHome}
                        style={styles.homeButton}
                        textStyle={{ fontSize: 11, letterSpacing: 1 }}
                    />
                </Animated.View>
            </ScrollView>
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
        opacity: 0.15,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 5, 8, 0.92)',
    },
    watermarkContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.03,
    },
    watermarkText: {
        fontSize: 80,
        transform: [{ rotate: '-45deg' }],
        color: '#FFF',
    },
    content: {
        paddingHorizontal: 25,
    },
    header: {
        marginBottom: 30,
        alignItems: 'flex-start',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
    },
    missionLabel: {
        fontSize: 10,
        opacity: 0.4,
        letterSpacing: 2,
    },
    screenTitle: {
        fontSize: 32,
        color: '#FFF',
        letterSpacing: 8,
    },
    headerLineContainer: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 10,
    },
    headerLine: {
        height: 2,
        backgroundColor: '#FFF',
        width: 40,
        opacity: 0.3,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 20,
        marginBottom: 40,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: '100%',
    },
    statLabel: {
        fontSize: 8,
        opacity: 0.3,
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        color: '#FFF',
    },
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 260,
        marginBottom: 50,
        gap: 12,
    },
    podiumPlace: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        position: 'relative',
    },
    firstPlace: {
        height: '100%',
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingTop: 45,
    },
    secondPlace: {
        height: '75%',
        paddingTop: 30,
    },
    thirdPlace: {
        height: '65%',
        paddingTop: 25,
    },
    rankBadgeSmall: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rankTextSmall: {
        fontSize: 8,
        color: 'rgba(255,255,255,0.6)',
    },
    mvpBadge: {
        position: 'absolute',
        top: -15,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    mvpText: {
        fontSize: 10,
        color: '#000',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    mvpGlow: {
        position: 'absolute',
        top: 20,
        width: '120%',
        height: 60,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 30,
        filter: 'blur(20px)',
    },
    podiumName: {
        fontSize: 8,
        opacity: 0.4,
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
    },
    podiumScore: {
        fontSize: 20,
        color: '#FFF',
    },
    firstPlaceScore: {
        fontSize: 32,
        color: '#FFF',
        textShadowColor: 'rgba(255,255,255,0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    creditsLabel: {
        fontSize: 7,
        opacity: 0.3,
        letterSpacing: 2,
        marginTop: -2,
    },
    tableContainer: {
        marginBottom: 40,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    tableHeaderLabel: {
        fontSize: 8,
        opacity: 0.2,
        letterSpacing: 1.5,
    },
    agentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 18,
        borderRadius: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    myRow: {
        borderColor: 'rgba(76, 175, 80, 0.3)',
        backgroundColor: 'rgba(76, 175, 80, 0.03)',
    },
    rowMainInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    rowRank: {
        fontSize: 10,
        opacity: 0.2,
    },
    rowAgentName: {
        fontSize: 14,
        color: '#FFF',
        letterSpacing: 1,
    },
    rowStatusBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    statusPositive: {
        backgroundColor: '#4CAF50',
    },
    statusNegative: {
        backgroundColor: '#FF6B6B',
    },
    statusLabelSmall: {
        fontSize: 8,
        opacity: 0.3,
    },
    rowScoreValue: {
        fontSize: 18,
        color: '#FFF',
        width: 50,
        textAlign: 'right',
    },
    footer: {
        marginTop: 10,
    },
    homeButton: {
        width: '100%',
    },
});
