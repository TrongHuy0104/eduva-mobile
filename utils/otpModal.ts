import { createElement, useCallback } from 'react';
import { useModal } from '@/contexts/modal.context';
import OtpConfirmForm from '@/components/settings/forms/OtpConfirmForm';

export const useOtpModal = () => {
  const { openModal, closeModal } = useModal();

  const showOtpModal = useCallback((
    onSubmit?: (otp: string) => void,
    onResend?: () => void
  ) => {
    openModal(
      createElement(OtpConfirmForm, {
        onSubmit,
        onResend
      })
    );
  }, [openModal]);

  const hideOtpModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    showOtpModal,
    hideOtpModal
  };
};
