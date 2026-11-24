import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from '../hooks/useTranslation';

interface LobbyModalsProps {
    showLeaveModal: boolean;
    showStartModal: boolean;
    setShowLeaveModal: (v: boolean) => void;
    setShowStartModal: (v: boolean) => void;
    isHost?: boolean;
    onConfirmLeave: () => void;
    onConfirmStart: () => void;
}

export function LobbyModals({
    showLeaveModal,
    showStartModal,
    setShowLeaveModal,
    setShowStartModal,
    isHost,
    onConfirmLeave,
    onConfirmStart
}: LobbyModalsProps) {
    const { t } = useTranslation();

    return (
        <>

            <ConfirmationModal
                visible={showLeaveModal}
                title={t('lobby.leave_title')}
                message={t(isHost ? 'lobby.leave_msg_host' : 'lobby.leave_msg')}
                confirmLabel={t('lobby.btn_leave')}
                cancelLabel={t('common.cancel')}
                onConfirm={onConfirmLeave}
                onCancel={() => setShowLeaveModal(false)}
            />

            <ConfirmationModal
                visible={showStartModal}
                title={t('lobby.start_op_title')}
                message={t('lobby.start_op_msg')}
                confirmLabel={t('lobby.btn_deploy_simple')}
                cancelLabel={t('common.cancel')}
                onConfirm={onConfirmStart}
                onCancel={() => setShowStartModal(false)}
            />
        </>
    );
}
