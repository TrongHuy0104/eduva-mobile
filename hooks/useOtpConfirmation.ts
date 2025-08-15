import { verifyOtp, VerifyOtpRequest } from '@/api/auth';
import { StatusCode } from '@/constants/status-code.constant';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { LoginRequest } from '@/types/requests/login.request';
import { AuthTokenResponse } from '@/types/responses/auth.response';
import { BaseResponse } from '@/types/responses/base.response';
import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useToast } from './useToast';

interface ExtendedVerifyOtpRequest extends VerifyOtpRequest {
    loginRequest: LoginRequest;
}

export const useOtpConfirmation = (): UseMutationResult<
    BaseResponse<AuthTokenResponse>,
    AxiosError<BaseResponse>,
    ExtendedVerifyOtpRequest
> => {
    const toast = useToast();
    const { login: authLogin, updateCurrentUser } = useAuth();
    const { closeModal } = useModal();
    const queryClient = useQueryClient();

    return useMutation<
        BaseResponse<AuthTokenResponse>,
        AxiosError<BaseResponse>,
        ExtendedVerifyOtpRequest
    >({
        mutationFn: async (req: ExtendedVerifyOtpRequest) => {
            const response = await verifyOtp({
                email: req.email,
                otpCode: req.otpCode,
            });

            if (!response.data) {
                throw new Error('OTP verification failed');
            }

            return response.data;
        },
        onSuccess: async (response) => {
            if (response.data?.accessToken && response.data?.refreshToken) {
                try {
                    // First login with new tokens
                    await authLogin({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    });

                    // Remove all queries to ensure clean slate
                    queryClient.removeQueries();

                    // Expose tokens in react-query cache so other hooks can detect auth status
                    queryClient.setQueryData(['auth-token'], {
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    });

                    // Force an immediate refetch of user data
                    const result = await queryClient.fetchQuery({
                        queryKey: ['user'],
                        queryFn: async () => {
                            const { getUserProfile } = await import(
                                '@/api/user'
                            );
                            return getUserProfile();
                        },
                        staleTime: 0,
                    });

                    if (result?.data) {
                        // Ensure auth context and persistent storage updated before proceeding
                        // result is an AxiosResponse with shape { data: BaseResponse<User> }
                        const userFromResponse = result.data?.data;
                        if (!userFromResponse)
                            throw new Error('No user in response');
                        await updateCurrentUser(userFromResponse);

                        // Keep the react-query cache in sync with the fetched response
                        queryClient.setQueryData(['user'], result);

                        // Invalidate the user query to ensure components using useQuery pick up the change
                        await queryClient.invalidateQueries({
                            queryKey: ['user'],
                            exact: true,
                        });

                        // Close modal after context and cache updated
                        closeModal();
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    toast.error(
                        'Xác minh thất bại',
                        'Không thể cập nhật thông tin người dùng.'
                    );
                }
            }
        },
        onError: (error) => {
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === StatusCode.OTP_INVALID_OR_EXPIRED) {
                toast.error(
                    'Xác minh thất bại',
                    'Mã OTP không chính xác hoặc đã hết hạn.'
                );
            } else {
                toast.error(
                    'Xác minh thất bại',
                    'Đã có lỗi xảy ra, vui lòng thử lại sau.'
                );
            }
        },
    });
};
