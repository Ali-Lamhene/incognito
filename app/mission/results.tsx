import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
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

    const sortedAgents = [...agents].sort((a, b) => (b.score || 0) - (a.score || 0));
    const isHost = session?.role === 'HOST';

    const handleBackHome = async () => {
        await clearSession(profile?.id);
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            {/* Background */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require("../../assets/images/agent_silhouette_rain.png")}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
                <View style={styles.backgroundOverlay} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                    <ThemedText type="code" style={styles.missionLabel}>
                        OPÉRATION TERMINÉE // ARCHIVAGE...
                    </ThemedText>
                    <ThemedText type="futuristic" style={styles.screenTitle}>
                        LEADERBOARD
                    </ThemedText>
                    <View style={styles.headerLine} />
                </Animated.View>

                {/* Podium Section */}
                <View style={styles.podiumContainer}>
                    {sortedAgents.slice(0, 3).map((agent, index) => (
                        <Animated.View
                            key={agent.id}
                            entering={FadeInUp.delay(300 + index * 100).duration(800)}
                            style={[
                                styles.podiumPlace,
                                index === 0 && styles.firstPlace,
                                index === 1 && styles.secondPlace,
                                index === 2 && styles.thirdPlace
                            ]}
                        >
                            <View style={[styles.rankBadge, index === 0 && styles.rankBadge1]}>
                                <ThemedText type="futuristic" style={styles.rankText}>
                                    {index + 1}
                                </ThemedText>
                            </View>

                            <View style={styles.avatarCircle}>
                                <Ionicons
                                    name={agent.avatar as any || "person"}
                                    size={index === 0 ? 40 : 30}
                                    color="#FFF"
                                />
                            </View>

                            <ThemedText type="code" numberOfLines={1} style={styles.agentCode}>
                                #{agent.name.toUpperCase()}
                            </ThemedText>

                            <ThemedText type="futuristic" style={styles.agentScore}>
                                {agent.score || 0}
                            </ThemedText>
                        </Animated.View>
                    ))}
                </View>

                {/* Full List */}
                <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.fullListContainer}>
                    <ThemedText type="code" style={styles.sectionLabel}>DÉBRIEFING COMPLET DES UNITÉS</ThemedText>

                    {sortedAgents.map((agent, index) => (
                        <View key={agent.id} style={styles.agentRow}>
                            <ThemedText type="code" style={styles.rowIndex}>0{index + 1}</ThemedText>
                            <View style={styles.rowAvatar}>
                                <Ionicons name={agent.avatar as any || "person"} size={16} color="rgba(255,255,255,0.6)" />
                            </View>
                            <ThemedText type="code" style={styles.rowName}>{agent.name}</ThemedText>
                            <View style={styles.rowScoreBox}>
                                <ThemedText type="futuristic" style={styles.rowScore}>{agent.score || 0}</ThemedText>
                                <ThemedText type="code" style={styles.rowUnit}>PTS</ThemedText>
                            </View>
                        </View>
                    ))}
                </Animated.View>

                {/* Footer Action */}
                <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.footer}>
                    <MainButton
                        title="RETOURNER AU QUARTIER GÉNÉRAL"
                        onPress={handleBackHome}
                        style={styles.homeButton}
                        textStyle={{ fontSize: 11 }}
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
        opacity: 0.2,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 5, 8, 0.9)',
    },
    content: {
        paddingHorizontal: 25,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    missionLabel: {
        fontSize: 10,
        opacity: 0.4,
        letterSpacing: 2,
        marginBottom: 10,
    },
    screenTitle: {
        fontSize: 28,
        color: '#FFF',
        letterSpacing: 6,
    },
    headerLine: {
        width: 60,
        height: 2,
        backgroundColor: '#FFF',
        marginTop: 15,
        opacity: 0.2,
    },
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 220,
        marginBottom: 50,
        gap: 15,
    },
    podiumPlace: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        paddingTop: 30,
        position: 'relative',
    },
    firstPlace: {
        height: '100%',
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        transform: [{ translateY: -10 }],
    },
    secondPlace: {
        height: '85%',
    },
    thirdPlace: {
        height: '75%',
    },
    rankBadge: {
        position: 'absolute',
        top: -15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankBadge1: {
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    rankText: {
        fontSize: 12,
        color: '#FFF',
    },
    avatarCircle: {
        marginBottom: 10,
    },
    agentCode: {
        fontSize: 8,
        opacity: 0.5,
        marginBottom: 5,
        width: '100%',
        textAlign: 'center',
    },
    agentScore: {
        fontSize: 24,
        color: '#FFF',
    },
    fullListContainer: {
        marginBottom: 40,
    },
    sectionLabel: {
        fontSize: 9,
        opacity: 0.3,
        letterSpacing: 2,
        marginBottom: 20,
    },
    agentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    rowIndex: {
        fontSize: 9,
        opacity: 0.2,
        width: 30,
    },
    rowAvatar: {
        width: 30,
        alignItems: 'center',
    },
    rowName: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        paddingLeft: 10,
    },
    rowScoreBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 5,
    },
    rowScore: {
        fontSize: 18,
        color: '#FFF',
    },
    rowUnit: {
        fontSize: 8,
        opacity: 0.3,
    },
    footer: {
        marginTop: 20,
    },
    homeButton: {
        width: '100%',
    },
});
