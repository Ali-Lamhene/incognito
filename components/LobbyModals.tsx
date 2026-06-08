import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from '../hooks/useTranslation';

interface LobbyModalsProps {
    showDestroyModal: boolean;
    showLeaveModal: boolean;
    showStartModal: boolean;
    setShowDestroyModal: (v: boolean) => void;
    setShowLeaveModal: (v: boolean) => void;
    setShowStartModal: (v: boolean) => void;
    onConfirmDestroy: () => void;
    onConfirmLeave: () => void;
    onConfirmStart: () => void;
}

export function LobbyModals({
    showDestroyModal,
    showLeaveModal,
    showStartModal,
    setShowDestroyModal,
    setShowLeaveModal,
    setShowStartModal,
    onConfirmDestroy,
    onConfirmLeave,
    onConfirmStart
}: LobbyModalsProps) {
    const { t } = useTranslation();

    return (
        <>
            <ConfirmationModal
                visible={showDestroyModal}
                title={t('lobby.abort_title')}
                message={t('lobby.abort_msg')}
                confirmLabel={t('lobby.btn_abort')}
                cancelLabel={t('common.cancel')}
                onConfirm={onConfirmDestroy}
                onCancel={() => setShowDestroyModal(false)}
                variant="danger"
            />

            <ConfirmationModal
                visible={showLeaveModal}
                title={t('lobby.leave_title')}
                message={t('lobby.leave_msg')}
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
