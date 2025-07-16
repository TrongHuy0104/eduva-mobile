// hooks/useAuthActions.ts
import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { StatusCode } from '@/constants/status-code.constant';
import { UserRoles } from '@/constants/user-roles.constant';
import { callGlobalLogout, useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { LoginRequest } from '@/types/requests/login.request';
import { AuthTokenResponse } from '@/types/responses/auth.response';
import { BaseResponse } from '@/types/responses/base.response';
import { router } from 'expo-router';
import { login } from '../api/auth';
import { useResendVerificationEmail } from './useEmail';
import { useToast } from './useToast';
import { useUser } from './useUser';

export const useLogin = (): UseMutationResult<
    BaseResponse<AuthTokenResponse>,
    AxiosError<BaseResponse>,
    LoginRequest
> => {
    const {
        login: authLogin,
        logout: authLogout,
        updateCurrentUser,
    } = useAuth();
    const { data: userProfile } = useUser();
    const { closeModal } = useModal();
    const { mutate: resendVerificationEmail } = useResendVerificationEmail();

    const queryClient = useQueryClient();
    const toast = useToast();

    const [pendingAfterLogin, setPendingAfterLogin] = useState(false);

    const handleAfterLogin = useCallback(
        (userProfile: any) => {
            if (!userProfile) {
                toast.errorGeneral();
                return null;
            }

            const userRoles = userProfile?.data?.roles;

            if (!userRoles?.includes(UserRoles.STUDENT)) {
                authLogout();
                // Clear user cache when user doesn't have required role
                queryClient.invalidateQueries({ queryKey: ['user'] });
                closeModal();
                // @ts-ignore
                router.push('/(routes)/errors/403');
                return null;
            }

            closeModal();
            // After successful login, invalidate and refetch user profile
            queryClient.invalidateQueries({ queryKey: ['user'] });
            return userProfile.data; // Always return user data if valid
        },
        [authLogout, queryClient, toast, closeModal]
    );

    useEffect(() => {
        if (pendingAfterLogin && userProfile) {
            const user = handleAfterLogin(userProfile);

            if (user) {
                updateCurrentUser(user); // Only update if user is valid
            }
            setPendingAfterLogin(false);
        }
    }, [pendingAfterLogin, userProfile, handleAfterLogin, updateCurrentUser]);

    return useMutation<
        BaseResponse<AuthTokenResponse>,
        AxiosError<BaseResponse>,
        LoginRequest
    >({
        mutationFn: async (loginRequest: LoginRequest) => {
            const response = await login(loginRequest);

            return response.data;
        },
        onSuccess: async (res) => {
            if (res.data) {
                await authLogin({
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                });
                // Remove old user cache
                queryClient.removeQueries({ queryKey: ['user'] });
                // Refetch user profile with new token
                queryClient.refetchQueries({ queryKey: ['user'] });
                setPendingAfterLogin(true);
            }
        },
        onError: (res, variables: LoginRequest) => {
            const statusCode = res.response?.data.statusCode;

            // Remove user cache on login error to prevent showing old profile
            queryClient.removeQueries({ queryKey: ['user'] });

            switch (statusCode) {
                case StatusCode.USER_NOT_EXISTS:
                case StatusCode.INVALID_CREDENTIALS:
                    toast.error(
                        'Đăng nhập thất bại',
                        'Tên đăng nhập hoặc mật khẩu chưa chính xác.'
                    );
                    break;
                case StatusCode.USER_NOT_CONFIRMED:
                    toast.error(
                        'Đăng nhập thất bại',
                        'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để hoàn tất xác minh.'
                    );

                    resendVerificationEmail({
                        email: variables.email,
                        clientUrl: process.env.EXPO_PUBLIC_CLIENT_URL,
                    });
                    break;
                case StatusCode.USER_ACCOUNT_LOCKED:
                    toast.error(
                        'Đăng nhập thất bại',
                        'Tài khoản của bạn đã bị vô hiệu hóa.'
                    );

                    break;
                default:
                    toast.errorGeneral();
            }
        },
    });
};

export const useLogout = (): UseMutationResult<
    void,
    AxiosError<BaseResponse>,
    void
> => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<BaseResponse>, void>({
        mutationFn: async () => {
            await callGlobalLogout();
        },
        onSuccess: () => {
            router.push('/(tabs)/home');
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout error:', error);
            // Still logout even if server logout fails
            callGlobalLogout();
            queryClient.clear();
        },
    });
};
