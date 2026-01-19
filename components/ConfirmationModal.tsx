import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { MainButton } from './MainButton';
import { ThemedText } from './ThemedText';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

export function ConfirmationModal({
    visible,
    title,
    message,
    confirmLabel = "CONFIRM",
    cancelLabel = "CANCEL",
    onConfirm,
    onCancel,
    variant = 'default'
}: ConfirmationModalProps) {

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onCancel}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.backdrop}
                    />

                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <Animated.View
                            entering={ZoomIn.duration(300)}
                            exiting={ZoomOut.duration(200)}
                            style={[styles.container, variant === 'danger' && styles.dangerBorder]}
                        >
                            <View style={styles.header}>
                                <ThemedText type="subtitle" style={[styles.title, variant === 'danger' && styles.dangerText]}>
                                    {title}
                                </ThemedText>
                                <View style={[styles.line, variant === 'danger' && styles.dangerLine]} />
                            </View>

                            <ThemedText type="default" style={styles.message}>
                                {message}
                            </ThemedText>

                            <View style={styles.actions}>
                                <MainButton
                                    title={cancelLabel}
                                    onPress={onCancel}
                                    variant="outline"
                                    style={styles.button}
                                    textStyle={{ fontSize: 12 }}
                                />
                                <MainButton
                                    title={confirmLabel}
                                    onPress={onConfirm}
                                    style={[
                                        styles.button,
                                        variant === 'danger' ? {
                                            borderColor: '#FFF',
                                            backgroundColor: '#FFF', // White background
                                            shadowColor: '#FFF',
                                            shadowOpacity: 0.2,
                                            shadowRadius: 4
                                        } : undefined
                                    ]}
                                    textStyle={variant === 'danger' ? { color: '#000', fontSize: 11, letterSpacing: 2, fontWeight: 'bold' } : { fontSize: 12 }}
                                />
                            </View>

                            {/* Decorative corners */}
                            <View style={styles.cornerTL} />
                            <View style={styles.cornerTR} />
                            <View style={styles.cornerBL} />
                            <View style={styles.cornerBR} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Ensure dark overlay
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.95)', // Darker backdrop
    },
    container: {
        width: '85%',
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 25,
        gap: 20,
    },
    dangerBorder: {
        borderColor: '#FFF', // White border for danger
        shadowColor: '#FFF',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    header: {
        gap: 10,
    },
    title: {
        fontSize: 18,
        letterSpacing: 2,
        textAlign: 'center',
    },
    dangerText: {
        color: '#FFF', // White text for danger
        textShadowColor: 'rgba(255, 255, 255, 0.2)',
        textShadowRadius: 2,
    },
    line: {
        height: 1,
        width: '40%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
    },
    dangerLine: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Brighter white line
    },
    message: {
        textAlign: 'center',
        opacity: 0.8,
        fontSize: 14,
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'column', // Stack vertically for long texts
        gap: 5,
        marginTop: 10,
        width: '100%',
    },
    button: {
        width: '100%', // Full width
    },
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 8, height: 8, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: -1, left: -1, width: 8, height: 8, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
});
