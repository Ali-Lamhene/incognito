import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useTranslation } from '../../hooks/useTranslation';

export default function JoinMissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const { t } = useTranslation();

    const scanLineY = useSharedValue(0);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withTiming(1, { duration: 2500, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedScanLineStyle = useAnimatedStyle(() => ({
        top: `${scanLineY.value * 80 + 10}%`, // Moves within the frame (roughly)
    }));

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        // Validates if it looks like a mission code (optional, but good)
        // For now, just assume any QR is a mission code or check length
        if (data) {
            // Add a small delay or haptic feel could be nice
            router.replace(`/lobby/${data}`);
        }
    };

    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText style={{ textAlign: 'center', color: '#FFF', marginBottom: 20 }}>{t('permissions.camera_msg')}</ThemedText>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <ThemedText type="code">{t('permissions.camera_btn')}</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            {/* Overlay Darkening */}
            <View style={styles.overlay}>
                <View style={styles.unfocusedContainer}></View>
                <View style={styles.middleContainer}>
                    <View style={styles.unfocusedContainer}></View>
                    <View style={styles.focusedContainer}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                        <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
                    </View>
                    <View style={styles.unfocusedContainer}></View>
                </View>
                <View style={styles.unfocusedContainer}></View>
            </View>

            {/* UI Content */}
            <View style={[styles.uiLayer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
                {/* Header */}
                <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ThemedText type="code" style={styles.backText}>{'<< ' + t('common.return')}</ThemedText>
                    </TouchableOpacity>
                    <ThemedText type="subtitle" style={styles.screenTitle}>{t('home.join_mission_title')}</ThemedText>
                </Animated.View>

                {/* Footer Instructions */}
                <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.footer}>
                    <View style={styles.instructionTag}>
                        <Ionicons name="scan-outline" size={20} color="#FFF" />
                        <ThemedText type="code" style={styles.instructionText}>{t('lobby.scan_instruction')}</ThemedText>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionButton: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '100%',
    },
    middleContainer: {
        flexDirection: 'row',
        height: 280,
    },
    focusedContainer: {
        width: 280,
        height: 280,
        position: 'relative',
    },
    uiLayer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 25,
    },
    header: {
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 5,
    },
    backText: {
        fontSize: 10,
        opacity: 0.8,
    },
    screenTitle: {
        fontSize: 18,
        letterSpacing: 2,
        color: '#FFF',
        marginTop: 5, // space for back button alignment roughly
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 10,
    },
    footer: {
        alignItems: 'center',
    },
    instructionTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    instructionText: {
        fontSize: 12,
        color: '#FFF',
    },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#FFF' },
    scanLine: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        shadowColor: 'red',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    }
});
