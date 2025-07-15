import { callGlobalLogout } from '@/contexts/auth.context';
import { getItem, setItem } from '@/utils/storage';
import axios from 'axios';
import { router } from 'expo-router';

const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
client.interceptors.request.use(async (config) => {
    const token = await getItem('accessToken');
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh when 401 occurs
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors for auth endpoints
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getItem('refreshToken');
                const accessToken = await getItem('accessToken');
                if (!refreshToken) throw new Error('No refresh token');

                // Call refresh token endpoint
                const { data } = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
                    {
                        refreshToken,
                        accessToken,
                    }
                );

                // Store new tokens
                await setItem('accessToken', data.accessToken);
                await setItem('refreshToken', data.refreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return client(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login if refresh fails
                await callGlobalLogout();
                router.push('/(tabs)/home');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
