// api/auth.js
import { LoginRequest } from '@/types/requests/login.request';
import { RefreshTokenRequest } from '@/types/requests/refresh-token.request';
import { AuthTokenResponse } from '@/types/responses/auth.response';
import { BaseResponse } from '@/types/responses/base.response';
import client from './client';

export interface VerifyOtpRequest {
    otpCode: string;
    email: string;
}

export enum ResendOtpPurpose {
    Login = 0,
    Enable2FA = 1,
    Disable2Fa = 2,
}

export interface ResendOtpRequest {
    email: string;
    purpose: ResendOtpPurpose;
}

export const login = (loginRequest: LoginRequest) => {
    return client.post<BaseResponse<AuthTokenResponse>>(
        '/auth/login',
        loginRequest
    );
};

export const verifyOtp = (req: VerifyOtpRequest) => {
    return client.post<BaseResponse<AuthTokenResponse>>(
        '/auth/verify-otp-login',
        req
    );
};

export const resendOtp = (req: ResendOtpRequest) => {
    return client.post<BaseResponse<void>>('/auth/resend-otp', req);
};

export const refreshToken = (refreshTokenRequest: RefreshTokenRequest) => {
    return client.post('/auth/refresh', refreshTokenRequest);
};

export const logout = () => {
    return client.post('/auth/logout');
};

export const getUserProfile = () => {
    return client.get('/users/me');
};
