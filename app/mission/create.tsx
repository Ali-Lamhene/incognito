import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DurationSelector } from '../../components/DurationSelector';
import { TerrainSelector } from '../../components/TerrainSelector';
import { AgentAdvice } from '../../components/AgentAdvice';
import { useTranslation } from '../../hooks/useTranslation';
import { useCreateMission } from '../../hooks/useCreateMission';
import { Theme } from '../../constants/Theme';

export default function CreateMissionScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const {
        duration, 
        setDuration, 
        customDuration, 
        setCustomDuration, 
        terrain,
        setTerrain,
        handleCreate, 
        isCustomInvalid 
    } = useCreateMission();

    return (
        <View style={styles.container}>
            <AgentHomeBackground totalBlack />
            
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}
                showsVerticalScrollIndicator={false}
            >
                <PageHeader title="créer une mission" />
                
                {/* Custom separator with fingerprint and faded side lines */}
                <View style={styles.separatorContainer}>
                    <LinearGradient
                        colors={['transparent', 'rgba(242, 232, 207, 0.25)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.separatorLine}
                    />
                    <Ionicons
                        name="finger-print-outline"
                        size={20}
                        color="rgba(242, 232, 207, 0.45)"
                        style={styles.separatorIcon}
                    />
                    <LinearGradient
                        colors={['rgba(242, 232, 207, 0.25)', 'transparent']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.separatorLine}
                    />
                </View>

                <View style={styles.selectorWrapper}>
                    <DurationSelector 
                        duration={duration}
                        setDuration={setDuration}
                        customDuration={customDuration}
                        setCustomDuration={setCustomDuration}
                        isCustomInvalid={isCustomInvalid}
                    />

                    <LinearGradient
                        colors={['transparent', 'rgba(242, 232, 207, 0.25)', 'transparent']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.simpleSeparator}
                    />

                    <TerrainSelector
                        terrain={terrain}
                        setTerrain={setTerrain}
                    />

                    <AgentAdvice />

                        <Button
                            title="lancer la mission"
                            onPress={handleCreate}
                            disabled={isCustomInvalid}
                            variant="primary"
                            icon="custom-target"
                        />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
        marginBottom: 8,
        paddingHorizontal: 70,
        width: '100%',
    },
    separatorLine: {
        flex: 1,
        height: 1,
    },
    separatorIcon: {
        marginHorizontal: 15,
    },
    subtitleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: Theme.colors.text.light,
        opacity: 0.75,
        textAlign: 'center',
        marginTop: 2,
    },
    selectorWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 12,
        marginTop: 5,
        gap: 15, // Reduced space between components
    },
    simpleSeparator: {
        width: '100%',
        height: 1,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
});

