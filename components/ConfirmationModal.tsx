import React from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Button } from './ui/Button';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/Theme';

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
    confirmLabel = "CONFIRMER",
    cancelLabel = "ANNULER",
    onConfirm,
    onCancel,
    variant = 'default'
}: ConfirmationModalProps) {

    if (!visible) return null;

    const renderMessage = (text: string) => {
        if (!text) return null;
        const parts = text.split('*');
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <Text key={index} style={styles.highlightText}>
                        {part}
                    </Text>
                );
            }
            return part;
        });
    };

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
                            style={styles.container}
                        >
                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={onCancel}
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={26} color={Theme.colors.red} />
                            </TouchableOpacity>

                            {/* Circular Spy Avatar */}
                            <View style={styles.avatarContainer}>
                                <FontAwesome5 
                                    name="user-secret" 
                                    size={95} 
                                    color="#000000" 
                                    style={styles.avatarIcon}
                                />
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Message */}
                            <Text style={styles.message}>
                                {renderMessage(message)}
                            </Text>

                            {/* Stacked Actions */}
                            <View style={styles.actions}>
                                <Button
                                    title={confirmLabel}
                                    onPress={onConfirm}
                                    variant="primary"
                                    style={styles.actionButton}
                                />
                                <Button
                                    title={cancelLabel}
                                    onPress={onCancel}
                                    variant="outline"
                                    style={styles.actionButton}
                                />
                            </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#0F0F0F',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: Theme.colors.red,
        backgroundColor: 'rgba(139, 30, 30, 0.4)',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 20,
        position: 'relative',
    },
    avatarIcon: {
        bottom: -12,
        position: 'absolute',
    },
    title: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 28,
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    message: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 18,
        textAlign: 'center',
        marginBottom: 25,
    },
    highlightText: {
        color: Theme.colors.red,
        fontFamily: 'Montserrat-SemiBold',
    },
    actions: {
        width: '100%',
        gap: 8,
    },
    actionButton: {
        width: '100%',
        height: 54,
        borderRadius: 8,
        marginVertical: 0,
    },
});
