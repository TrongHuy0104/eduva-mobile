import * as SecureStore from 'expo-secure-store';

// Store any sensitive data
export const setItem = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('SecureStore setItem error:', error);
        throw error;
    }
};

// Retrieve stored data
export const getItem = async (key: string) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error('SecureStore getItem error:', error);
        return null;
    }
};

// Remove stored data (logout)
export const removeItem = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('SecureStore removeItem error:', error);
    }
};
