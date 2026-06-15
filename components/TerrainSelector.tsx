import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/Theme';
import { Image } from 'expo-image';
import { TargetIcon } from './ui/TargetIcon';

export interface TerrainSelectorProps {
    terrain: number;
    setTerrain: (t: number) => void;
}

const terrains = [
    { 
        id: 1, 
        name: 'BASE SECRÈTE', 
        subtitle: 'À la maison ou chez des amis',
        icon: 'home' as const,
        image: require('../assets/UI/incognito_param_mission_bg_home.png') 
    },
    { 
        id: 2, 
        name: 'TERRAIN LIBRE', 
        subtitle: 'Parcs, rues, places et espaces publics',
        icon: 'earth' as const,
        image: require('../assets/UI/incognito_param_mission_bg_free.png') 
    },
    { 
        id: 3, 
        name: 'INFILTRATION', 
        subtitle: 'Bars, restaurants et lieux animés',
        icon: 'wine' as const,
        image: require('../assets/UI/incognito_param_mission_bg_infiltration.png') 
    },
];

export function TerrainSelector({ terrain, setTerrain }: TerrainSelectorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TargetIcon size={18} color={Theme.colors.red} />
                <Text style={styles.headerText}>TERRAIN D'OPÉRATION</Text>
            </View>

            <View style={styles.cardsRow}>
                {terrains.map((t) => {
                    const isSelected = terrain === t.id;
                    return (
                        <TouchableOpacity
                            key={t.id}
                            activeOpacity={0.8}
                            onPress={() => setTerrain(t.id)}
                            style={[
                                styles.card,
                                isSelected && styles.cardActive
                            ]}
                        >
                            <Image 
                                source={t.image} 
                                style={[StyleSheet.absoluteFill, !isSelected && { opacity: 0.3 }]} 
                                contentFit="cover" 
                            />
                            <View style={[StyleSheet.absoluteFill, styles.overlay, isSelected && styles.overlayActive]} />
                            
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Ionicons 
                                        name={t.icon} 
                                        size={18} 
                                        color={isSelected ? Theme.colors.red : Theme.colors.text.light} 
                                        style={!isSelected && { opacity: 0.8 }}
                                    />
                                </View>
                                <Text 
                                    style={[styles.cardTitle, isSelected && styles.cardTitleActive]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                >
                                    {t.name}
                                </Text>
                                <Text 
                                    style={[styles.cardSubtitle, isSelected && styles.cardSubtitleActive]}
                                    numberOfLines={2}
                                >
                                    {t.subtitle}
                                </Text>
                            </View>

                            {isSelected && (
                                <View style={styles.activeTriangle} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 15,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 16,
        color: Theme.colors.text.light,
        letterSpacing: 1,
    },
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    card: {
        flex: 1,
        height: 160,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#000', // Base black to act as the "grayscale" background
    },
    cardActive: {
        borderColor: Theme.colors.red,
    },
    overlay: {
        backgroundColor: '#000',
        opacity: 0.4, // Lighter overlay since the image itself is fading out
    },
    overlayActive: {
        opacity: 0.2, // Very transparent when active to reveal colors
    },
    cardContent: {
        padding: 8,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        gap: 4,
    },
    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 16,
        color: Theme.colors.text.light,
        opacity: 0.6,
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        textAlign: 'center',
    },
    cardTitleActive: {
        color: Theme.colors.red,
        opacity: 1,
    },
    cardSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 10,
        color: Theme.colors.text.light,
        opacity: 0.5,
        textAlign: 'center',
        lineHeight: 14,
    },
    cardSubtitleActive: {
        opacity: 0.9,
    },
    activeTriangle: {
        position: 'absolute',
        bottom: -1,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Theme.colors.red,
    },
});
