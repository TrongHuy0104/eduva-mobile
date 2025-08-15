import { resendOtp, ResendOtpPurpose } from '@/api/auth';
import { BaseResponse } from '@/types/responses/base.response';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useToast } from './useToast';

interface ExtendedResendOtpRequest {
    email: string;
    resetTimer?: () => void;
}

export const useOtpResend = (): UseMutationResult<
    void,
    AxiosError<BaseResponse>,
    ExtendedResendOtpRequest
> => {
    const toast = useToast();

    return useMutation<
        void,
        AxiosError<BaseResponse>,
        ExtendedResendOtpRequest
    >({
        mutationFn: async (req: ExtendedResendOtpRequest) => {
            await resendOtp({
                email: req.email,
                purpose: ResendOtpPurpose.Login,
            });

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
        onError: (error) => {
            console.error('Error resending OTP:', error);
            toast.error(
                'Gửi lại mã thất bại',
                'Không thể gửi mã OTP mới. Vui lòng thử lại sau.'
            );
        },
    });
};
