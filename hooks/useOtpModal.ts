import { useState, useCallback, createElement } from 'react';
import { useModal } from '@/contexts/modal.context';
import OtpConfirmForm from '@/components/settings/forms/OtpConfirmForm';

interface OtpModalCallbacks {
  onSubmit: (otp: string) => void;
  onResend?: () => void;
}

export const useOtpModal = () => {
  const { openModal, closeModal } = useModal();
  const [pendingOtpValidation, setPendingOtpValidation] = useState(false);

  const showOtpModal = useCallback((callbacks: OtpModalCallbacks) => {
    openModal(
      createElement(OtpConfirmForm, {
        onSubmit: (otp: string) => {
          if (callbacks.onSubmit) {
            callbacks.onSubmit(otp);
          }
        },
        onResend: callbacks.onResend
      })
    );
    setPendingOtpValidation(true);
  }, [openModal]);

  const hideOtpModal = useCallback(() => {
    closeModal();
    setPendingOtpValidation(false);
  }, [closeModal]);

  return {
    showOtpModal,
    hideOtpModal,
    pendingOtpValidation
  };
};
