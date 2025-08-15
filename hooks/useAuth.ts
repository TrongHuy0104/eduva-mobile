// hooks/useAuthActions.ts
import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createElement, useCallback, useEffect, useState } from 'react';

import { StatusCode } from '@/constants/status-code.constant';
import { UserRoles } from '@/constants/user-roles.constant';
import { callGlobalLogout, useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { LoginRequest } from '@/types/requests/login.request';
import { AuthTokenResponse } from '@/types/responses/auth.response';
import { BaseResponse } from '@/types/responses/base.response';
import { router } from 'expo-router';
import { login } from '../api/auth';
import OtpConfirmForm from '../components/settings/forms/OtpConfirmForm';
import { useResendVerificationEmail } from './useEmail';
import { useOtpConfirmation } from './useOtpConfirmation';
import { useOtpResend } from './useOtpResend';
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
    const { openModal, closeModal } = useModal();
    const { mutate: resendVerificationEmail } = useResendVerificationEmail();
    const { mutateAsync: verifyOtpAsync } = useOtpConfirmation();
    const { mutate: resendOtp } = useOtpResend();

    const queryClient = useQueryClient();
    const toast = useToast();

    const [pendingAfterLogin, setPendingAfterLogin] = useState(false);
    const [loginRequest, setLoginRequest] = useState<LoginRequest | null>(null);

    const handleAfterLogin = useCallback(
        (userProfile: any) => {
            if (!userProfile?.data) {
                toast.errorGeneral();
                return null;
            }

            const userRoles = userProfile.data.roles;

            if (!userRoles?.includes(UserRoles.STUDENT)) {
                authLogout();
                // Clear user cache when user doesn't have required role
                queryClient.removeQueries({ queryKey: ['user'] });
                // @ts-ignore
                router.push('/(routes)/errors/403');
                return null;
            }

            // Return user data directly without additional invalidation
            return userProfile.data;
        },
        [authLogout, queryClient, toast, closeModal]
    );

    useEffect(() => {
        const hasToken = Boolean(queryClient.getQueryData(['auth-token']));
        if (userProfile && (pendingAfterLogin || hasToken)) {
            const user = handleAfterLogin(userProfile);

            if (user) {
                updateCurrentUser(user); // Only update if user is valid
                setPendingAfterLogin(false);
            }
        }
    }, [
        pendingAfterLogin,
        userProfile,
        handleAfterLogin,
        updateCurrentUser,
        queryClient,
    ]);

    return useMutation<
        BaseResponse<AuthTokenResponse>,
        AxiosError<BaseResponse>,
        LoginRequest
    >({
        mutationFn: async (loginRequest: LoginRequest) => {
            setLoginRequest(loginRequest);
            const response = await login(loginRequest);

            return response.data;
        },
        onSuccess: async (res) => {
            if (res.data) {
                if (res.statusCode === StatusCode.SUCCESS) {
                    // Save tokens first
                    await authLogin({
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                    });
                    closeModal();

                    // Clear queries and expose tokens in react-query cache so other hooks detect auth
                    queryClient.removeQueries();
                    queryClient.setQueryData(['auth-token'], {
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                    });

                    try {
                        // Immediately fetch user profile with new token
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

                        const userFromResponse = result?.data?.data;
                        if (userFromResponse) {
                            await updateCurrentUser(userFromResponse);
                            // Sync react-query cache
                            queryClient.setQueryData(['user'], result);
                            await queryClient.invalidateQueries({
                                queryKey: ['user'],
                                exact: true,
                            });

                            // Debug stored values
                            try {
                                const storage = await import('@/utils/storage');
                                const storedUser = await storage.getItem(
                                    'user'
                                );
                                const storedAccess = await storage.getItem(
                                    'accessToken'
                                );
                                const storedRefresh = await storage.getItem(
                                    'refreshToken'
                                );
                                console.log(
                                    'DEBUG LOGIN: storedUser=',
                                    storedUser
                                );
                                console.log(
                                    'DEBUG LOGIN: accessToken=',
                                    storedAccess,
                                    'refreshToken=',
                                    storedRefresh
                                );
                                const cachedUser = queryClient.getQueryData([
                                    'user',
                                ]);
                                console.log(
                                    'DEBUG LOGIN: queryCache user=',
                                    cachedUser
                                );
                            } catch (e) {
                                console.warn(
                                    'DEBUG LOGIN: storage debug failed',
                                    e
                                );
                            }
                        }

                        setPendingAfterLogin(false);
                        closeModal();
                    } catch (err) {
                        // If fetching profile fails, keep pending flag so UI can retry
                        setPendingAfterLogin(true);
                        console.error(
                            'Failed to fetch profile after login:',
                            err
                        );
                    }
                } else if (
                    res.statusCode === StatusCode.REQUIRES_OTP_VERIFICATION
                ) {
                    // Handle OTP verification required
                    if (!loginRequest) return;

                    setPendingAfterLogin(true);
                    const currentLoginRequest = loginRequest;

                    openModal(
                        createElement(OtpConfirmForm, {
                            onSubmit: (otp: string) => {
                                // return a Promise so the form can await and show loading
                                return verifyOtpAsync({
                                    email: currentLoginRequest.email,
                                    otpCode: otp,
                                    loginRequest: currentLoginRequest,
                                });
                            },
                            onResend: (resetTimer) => {
                                if (!currentLoginRequest) {
                                    console.log('No login request found');
                                    return;
                                }

                                resendOtp({
                                    email: currentLoginRequest.email,
                                    resetTimer,
                                });
                            },
                        })
                    );
                }
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
