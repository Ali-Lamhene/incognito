import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AgentHomeBackground } from '../../components/AgentHomeBackground';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useCreateMission } from '../../hooks/useCreateMission';
import { Theme } from '../../constants/Theme';

export default function CreateMissionScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { handleCreate, isCustomInvalid } = useCreateMission();

    return (
        <View style={styles.container}>
            <AgentHomeBackground totalBlack />
            
            <View style={{ paddingTop: insets.top }}>
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

                {/* Subtitle */}
                <Text style={styles.subtitleText}>
                    Choisissez la durée de votre mission
                </Text>
            </View>

            {/* Bottom Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Button
                    title="lancer la mission"
                    onPress={handleCreate}
                    disabled={isCustomInvalid}
                    variant="primary"
                    icon="custom-target"
                />
            </View>
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
        marginVertical: 10,
        paddingHorizontal: 40,
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
        marginTop: 5,
    },
    footer: {
        paddingHorizontal: 25,
        width: '100%',
    },
});

