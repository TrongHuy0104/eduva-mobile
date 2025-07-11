// api/auth.js
import { LoginRequest } from '@/types/requests/login.request';
import { RefreshTokenRequest } from '@/types/requests/refresh-token.request';
import client from './client';

export const login = (loginRequest: LoginRequest) => {
    return client.post('/auth/login', loginRequest);
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
