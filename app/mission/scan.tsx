import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useSession } from '../../context/SessionContext';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../../components/ui/PageHeader';
import { Theme } from '../../constants/Theme';

export default function ScanMissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const { checkSessionExists } = useSession();
    const { t } = useTranslation();
    const [error, setError] = useState(false);
    const [scanned, setScanned] = useState(false);

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
        top: `${scanLineY.value * 80 + 10}%`,
    }));

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (data && !scanned) {
            setScanned(true);
            const normalized = data.trim().toUpperCase();
            const exists = await checkSessionExists(normalized);

            if (exists) {
                router.replace(`/lobby/${normalized}`);
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                    setScanned(false); // Let them try scanning again
                }, 3000);
            }
        }
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                <Ionicons name="camera-outline" size={48} color="#FFF" style={{ marginBottom: 20, opacity: 0.5 }} />
                <ThemedText style={{ textAlign: 'center', color: '#FFF', marginBottom: 20 }}>{t('permissions.camera_msg')}</ThemedText>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <ThemedText type="code" style={{ color: '#000', fontWeight: 'bold' }}>{t('permissions.camera_btn')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <ThemedText type="code" style={{ opacity: 0.6 }}>{t('common.return')}</ThemedText>
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

            <View style={[styles.uiLayer, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}>
                <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
                    <PageHeader 
                        title={t('join.scan_header')} 
                        showSeparator 
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.footer}>
                    {error ? (
                        <View style={[styles.instructionTag, { borderColor: Theme.colors.red, backgroundColor: 'rgba(139, 30, 30, 0.2)' }]}>
                            <Ionicons name="alert-circle" size={20} color={Theme.colors.red} />
                            <Text style={[styles.instructionText, { color: Theme.colors.red }]}>
                                {t('join.scan_error')}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.instructionTag}>
                            <Ionicons name="scan-outline" size={20} color={Theme.colors.red} />
                            <Text style={styles.instructionText}>{t('join.scan_instruction')}</Text>
                        </View>
                    )}
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
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '100%',
    },
    middleContainer: {
        flexDirection: 'row',
        height: 260,
    },
    focusedContainer: {
        width: 260,
        height: 260,
        position: 'relative',
    },
    uiLayer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 25,
    },
    header: {
        alignItems: 'center',
        width: '100%',
    },
    footer: {
        alignItems: 'center',
    },
    instructionTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        width: '85%',
    },
    instructionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#FFF',
        width: '85%',
        textAlign: 'center',
    },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 25, height: 25, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Theme.colors.red },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 25, height: 25, borderTopWidth: 3, borderRightWidth: 3, borderColor: Theme.colors.red },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 25, height: 25, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Theme.colors.red },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 25, height: 25, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Theme.colors.red },
    scanLine: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 2,
        backgroundColor: Theme.colors.red,
        shadowColor: Theme.colors.red,
        shadowOpacity: 1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 },
    }
});
