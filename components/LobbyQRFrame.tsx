import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/Theme';

interface LobbyQRFrameProps {
    code: string;
    scannerStyle: any;
    onCopy: () => void;
    children?: React.ReactNode;
}

export function LobbyQRFrame({
    code,
    scannerStyle,
    onCopy,
    children
}: LobbyQRFrameProps) {
    return (
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.cardContainer}>
            {/* City Background Texture */}
            <Image 
                source={require('../assets/UI/texture_city.png')}
                style={styles.cardBackground}
                contentFit="cover"
            />
            {/* Dark overlay to fade bottom slightly if needed, or just red overlay */}
            <View style={styles.cardOverlay} />

            {/* Top Code Section */}
            <View style={styles.codeHeader}>
                <Text style={styles.codeLabel}>CODE DE MISSION</Text>
                <TouchableOpacity onPress={onCopy} activeOpacity={0.7} style={styles.codeRow}>
                    <Ionicons name="star" size={14} color={Theme.colors.red} />
                    <Text style={styles.missionCodeText}>{code}</Text>
                    <Ionicons name="star" size={14} color={Theme.colors.red} />
                </TouchableOpacity>
            </View>

            {/* QR Code */}
            <View style={styles.qrWrapper}>
                <ImageBackground 
                    source={require('../assets/UI/paper.png')}
                    style={styles.qrFrame}
                    imageStyle={styles.qrImageStyle}
                >
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={code || 'ERROR'}
                            size={180}
                            color="#000"
                            backgroundColor="transparent"
                        />
                    </View>

                    {/* Corners */}
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </ImageBackground>
            </View>

            <View style={styles.hintContainer}>
                <Ionicons name="qr-code-outline" size={16} color="#A0A0A0" />
                <Text style={styles.copyHint}>Scannez pour rejoindre la mission</Text>
            </View>

            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'rgba(20, 5, 5, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 0, 0.3)',
        borderRadius: 8,
        padding: 15,
        gap: 10,
        alignItems: 'center',
        overflow: 'hidden', // Add this so background doesn't bleed out
    },
    cardBackground: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 5, 5, 0.5)',
    },
    codeHeader: {
        alignItems: 'center',
    },
    codeLabel: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 12,
        color: Theme.colors.red,
        letterSpacing: 1,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    missionCodeText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 36,
        color: '#E0E0E0',
        letterSpacing: 3,
    },
    qrWrapper: {
        alignItems: 'center',
        marginVertical: 5,
    },
    qrFrame: {
        padding: 25,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrImageStyle: {
        borderRadius: 8,
    },
    qrContainer: {
        backgroundColor: 'transparent',
    },
    cornerTL: { position: 'absolute', top: 5, left: 5, width: 15, height: 15, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#5C2D2D' },
    cornerTR: { position: 'absolute', top: 5, right: 5, width: 15, height: 15, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#5C2D2D' },
    cornerBL: { position: 'absolute', bottom: 5, left: 5, width: 15, height: 15, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#5C2D2D' },
    cornerBR: { position: 'absolute', bottom: 5, right: 5, width: 15, height: 15, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#5C2D2D' },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 0,
    },
    copyHint: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 10,
        color: '#A0A0A0',
    },
});
