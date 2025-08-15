import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useToast } from './useToast';
import { BaseResponse } from '@/types/responses/base.response';
import { ResendOtpRequest, ResendOtpPurpose, resendOtp } from '@/api/auth';

interface ExtendedResendOtpRequest extends Omit<ResendOtpRequest, 'purpose'> {
  resetTimer?: () => void;
}

export const useResendOtp = (): UseMutationResult<
  void,
  AxiosError<BaseResponse>,
  ExtendedResendOtpRequest
> => {
  const toast = useToast();

  return useMutation<void, AxiosError<BaseResponse>, ExtendedResendOtpRequest>({
    mutationFn: async (req: ExtendedResendOtpRequest) => {
      await resendOtp({
        email: req.email,
        purpose: ResendOtpPurpose.Login // For login flow
      });
      
      // Reset the timer if provided
      if (req.resetTimer) {
        req.resetTimer();
      }
    },
    onSuccess: () => {
      toast.success(
        'Gửi lại mã thành công',
        'Mã OTP mới đã được gửi đến email của bạn.'
      );
    },
    onError: () => {
      toast.error(
        'Gửi lại mã thất bại',
        'Không thể gửi mã OTP mới. Vui lòng thử lại sau.'
      );
    },
  });
};
