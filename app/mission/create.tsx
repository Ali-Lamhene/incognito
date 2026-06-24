import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
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
        <View style={[styles.container, { backgroundColor: '#000' }]}>
            {/* Ambient City Background with Red Halo */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320, overflow: 'hidden' }}>
                <Image
                    source={require('../../assets/UI/texture_city.png')}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.4 }]}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(139, 30, 30, 0.25)', 'transparent']}
                    locations={[0.2, 0.6, 0.9]}
                    style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                    colors={['transparent', '#000000']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 150,
                    }}
                />
            </View>
            
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}
                showsVerticalScrollIndicator={false}
            >
                <PageHeader title="créer une mission" showSeparator />

                <View style={styles.selectorWrapper}>
                    <View style={styles.contentBlock}>
                        <DurationSelector 
                            duration={duration}
                            setDuration={setDuration}
                            customDuration={customDuration}
                            setCustomDuration={setCustomDuration}
                            isCustomInvalid={isCustomInvalid}
                        />
                    </View>

                    <View style={styles.contentBlock}>
                        <TerrainSelector
                            terrain={terrain}
                            setTerrain={setTerrain}
                        />
                    </View>

                    <View style={styles.contentBlock}>
                        <AgentAdvice />
                    </View>

                    <View style={styles.buttonBlock}>
                        <Button
                            title="lancer la mission"
                            onPress={handleCreate}
                            disabled={isCustomInvalid}
                            variant="primary"
                            icon="custom-target"
                        />
                    </View>
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
        paddingHorizontal: 15,
        marginTop: 10,
        justifyContent: 'space-between', 
    },
    contentBlock: {
        marginVertical: 10,
    },
    buttonBlock: {
        marginTop: 'auto',
        paddingTop: 15,
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

