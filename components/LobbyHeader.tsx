import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Theme } from '../constants/Theme';

interface LobbyHeaderProps {
    isHost: boolean;
    onBack: () => void;
    onAbort: () => void;
}

export function LobbyHeader({
    isHost,
    onBack,
    onAbort
}: LobbyHeaderProps) {
    return (
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={20} color="#D1D1D1" />
                    <Text style={styles.backText}>RETOUR</Text>
                </TouchableOpacity>

                <View style={styles.centerTitleContainer}>
                    <Text style={styles.screenTitle}>SALON D'OPÉRATION</Text>
                    <Text style={styles.subTitle}>EN ATTENTE D'AGENTS</Text>
                </View>

                {/* Always show the abort button as QUITTER LE SALON based on the mockup.
                    We use onAbort for both host (destroy) and guest (leave), 
                    the parent handles the different actions. */}
                <TouchableOpacity onPress={onAbort} style={styles.destroyButton}>
                    <MaterialCommunityIcons name="exit-run" size={16} color={Theme.colors.red} style={styles.exitIcon} />
                    <View>
                        <Text style={styles.destroyText}>QUITTER</Text>
                        <Text style={styles.destroyText}>LE SALON</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 15,
        paddingTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        width: 90,
    },
    backText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#D1D1D1',
        letterSpacing: 1,
        marginLeft: 2,
    },
    centerTitleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    screenTitle: {
        fontFamily: 'BebasNeue-Bold',
        color: '#FFF',
        fontSize: 28,
        letterSpacing: 2,
        marginBottom: 2,
    },
    subTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: Theme.colors.red,
        letterSpacing: 1,
    },
    destroyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 0, 0.4)',
        width: 90,
        justifyContent: 'center',
    },
    exitIcon: {
        marginRight: 4,
    },
    destroyText: {
        fontFamily: 'BebasNeue-Bold',
        color: Theme.colors.red,
        fontSize: 11,
        lineHeight: 12,
        textAlign: 'center',
    },
});
