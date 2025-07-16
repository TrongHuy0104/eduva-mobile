import { UpdateProfileRequest } from '@/types/requests/update-profile.request';
import client from './client';

export const getUserProfile = () => {
    return client.get('/users/profile');
};

export const updateProfile = (req: UpdateProfileRequest) => {
    return client.put('/users/profile', req);
};
