import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { ConfirmationModal } from './ConfirmationModal';
import { Button } from './ui/Button';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/Theme';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';

interface ActiveModalsProps {
  showAbortModal: boolean;
  setShowAbortModal: (show: boolean) => void;
  handleAbort: () => void;
  showUnmaskModal: boolean;
  setShowUnmaskModal: (show: boolean) => void;
  handleConfirmUnmask: () => void;
  targetAgentName?: string | null;
  me?: Agent | null;
  handleConfessAccusation?: (challengeId: string) => void;
  handleDenyAccusation?: () => void;
}

export function ActiveModals({
  showAbortModal,
  setShowAbortModal,
  handleAbort,
  showUnmaskModal,
  setShowUnmaskModal,
  handleConfirmUnmask,
  targetAgentName,
  me,
  handleConfessAccusation,
  handleDenyAccusation,
}: ActiveModalsProps) {
  const { t } = useTranslation();
  const [showChallengeSelection, setShowChallengeSelection] = useState(false);

  const myChallenges = me?.challenges || (me?.challenge ? [me.challenge] : []);

  // When accusation is resolved or closed, reset local state
  React.useEffect(() => {
    if (!me?.pendingAccusation) {
      setShowChallengeSelection(false);
    }
  }, [me?.pendingAccusation]);

  const handleConfessPress = () => {
    setShowChallengeSelection(true);
  };

  const handleSelectChallenge = (challengeId: string) => {
    if (handleConfessAccusation) {
      handleConfessAccusation(challengeId);
    }
    setShowChallengeSelection(false);
  };

  return (
    <>
      <ConfirmationModal
        visible={showAbortModal}
        title={t("mission.abort_title")}
        message={t("mission.abort_msg")}
        confirmLabel={t("mission.btn_leave_mission")}
        cancelLabel={t("mission.btn_stay")}
        variant="danger"
        onConfirm={handleAbort}
        onCancel={() => setShowAbortModal(false)}
      />

      <ConfirmationModal
        visible={showUnmaskModal}
        title={t("mission.unmask_popup_title")}
        message={t("mission.unmask_popup_msg").replace("{{name}}", targetAgentName || "")}
        confirmLabel={t("mission.unmask_popup_btn")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmUnmask}
        onCancel={() => setShowUnmaskModal(false)}
      />

      {/* Custom Accusation & Challenge Selection Modal */}
      <Modal
        transparent
        visible={!!me?.pendingAccusation}
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleDenyAccusation}
      >
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
              {/* Circular Spy Avatar */}
              <View style={styles.avatarContainer}>
                <FontAwesome5 
                  name="user-secret" 
                  size={95} 
                  color="#000000" 
                  style={styles.avatarIcon}
                />
              </View>

              {!showChallengeSelection ? (
                <>
                  {/* Step 1: Accusation alert */}
                  <Text style={styles.title}>
                    {t("mission.unmask_attempt_self").replace("{{name}}", me?.pendingAccusation?.byName || "")}
                  </Text>
                  <Text style={styles.message}>
                    {t("mission.unmask_attempt_msg").replace("{{name}}", me?.pendingAccusation?.byName || "")}
                  </Text>

                  <View style={styles.actions}>
                    <Button
                      title={t("mission.unmask_confess")}
                      onPress={handleConfessPress}
                      variant="primary"
                      style={styles.actionButton}
                    />
                    <Button
                      title={t("mission.unmask_deny")}
                      onPress={handleDenyAccusation || (() => {})}
                      variant="outline"
                      style={styles.actionButton}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* Step 2: Challenge selection */}
                  <Text style={styles.title}>
                    {t("mission.which_challenge_title")}
                  </Text>
                  <Text style={styles.message}>
                    {t("mission.which_challenge_msg").replace("{{name}}", me?.pendingAccusation?.byName || t("common.unknown"))}
                  </Text>

                  <View style={styles.challengesList}>
                    {myChallenges.map((challenge, idx) => (
                      <TouchableOpacity
                        key={challenge.id || idx}
                        activeOpacity={0.8}
                        onPress={() => handleSelectChallenge(challenge.id)}
                        style={styles.challengeItem}
                      >
                        <Text style={styles.challengeItemText} numberOfLines={2}>
                          {challenge.text}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color={Theme.colors.red} />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Button
                    title={t("common.return")}
                    onPress={() => setShowChallengeSelection(false)}
                    variant="outline"
                    style={[styles.actionButton, { marginTop: 15 }]}
                  />
                </>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
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
  challengesList: {
    width: '100%',
    gap: 10,
  },
  challengeItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  challengeItemText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#FFF',
    lineHeight: 16,
  },
});
