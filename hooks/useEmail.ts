import { resendConfirmEmail } from '@/api/email';
import { EmailLinkRequest } from '@/types/requests/email-link.request';
import { BaseResponse } from '@/types/responses/base.response';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useToast } from './useToast';

export const useResendVerificationEmail = (): UseMutationResult<
    void,
    AxiosError<BaseResponse>,
    EmailLinkRequest
> => {
    const toast = useToast();

    return useMutation<void, AxiosError<BaseResponse>, EmailLinkRequest>({
        mutationFn: async (req: EmailLinkRequest) => {
            await resendConfirmEmail(req);
        },
        onSuccess: () => {
            toast.success(
                'Email xác minh đã được gửi lại',
                'Vui lòng kiểm tra email của bạn để hoàn tất xác minh.'
            );
        },
        onError: (err) => {
            console.log(err);

            toast.errorGeneral();
        },
    });
};
