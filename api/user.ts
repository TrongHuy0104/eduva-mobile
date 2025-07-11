import client from './client';

export const getUserProfile = () => {
    return client.get('/users/profile');
};
