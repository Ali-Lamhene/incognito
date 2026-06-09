import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from '../hooks/useTranslation';

interface ActiveModalsProps {
  showAbortModal: boolean;
  setShowAbortModal: (show: boolean) => void;
  handleAbort: () => void;
  showUnmaskModal: boolean;
  setShowUnmaskModal: (show: boolean) => void;
  handleConfirmUnmask: () => void;
}

export function ActiveModals({
  showAbortModal,
  setShowAbortModal,
  handleAbort,
  showUnmaskModal,
  setShowUnmaskModal,
  handleConfirmUnmask,
}: ActiveModalsProps) {
  const { t } = useTranslation();

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
        message={t("mission.unmask_popup_msg")}
        confirmLabel={t("mission.unmask_popup_btn")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmUnmask}
        onCancel={() => setShowUnmaskModal(false)}
      />
    </>
  );
}
