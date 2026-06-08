import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface LobbyQRFrameProps {
    code: string;
    scannerStyle: any;
    onCopy: () => void;
}

export function LobbyQRFrame({
    code,
    scannerStyle,
    onCopy
}: LobbyQRFrameProps) {
    const { t } = useTranslation();

    return (
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.codeSection}>
            <Animated.View style={[styles.qrFrame, scannerStyle]}>
                <View style={styles.qrContainer}>
                    <QRCode
                        value={code || 'ERROR'}
                        size={180}
                        color="black"
                        backgroundColor="white"
                    />
                </View>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
            </Animated.View>

            <TouchableOpacity onPress={onCopy} style={styles.codeDisplay}>
                <ThemedText type="futuristic" style={styles.missionCodeText}>{code}</ThemedText>
                <ThemedText type="code" style={styles.copyHint}>{t('lobby.copy_hint')}</ThemedText>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    codeSection: {
        alignItems: 'center',
        gap: 20,
    },
    qrFrame: {
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative',
    },
    qrContainer: {
        padding: 10,
        backgroundColor: '#FFF',
    },
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    codeDisplay: {
        alignItems: 'center',
    },
    missionCodeText: {
        fontSize: 28,
        color: '#FFF',
        letterSpacing: 3,
        textAlign: 'center',
    },
    copyHint: {
        fontSize: 8,
        opacity: 0.4,
        marginTop: 5,
    },
});
