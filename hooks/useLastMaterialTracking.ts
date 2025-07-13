import { useAuth } from '@/contexts/auth.context';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { useCallback } from 'react';

interface LastLesson {
    folder: string;
    material: string;
}

export const useLastMaterialTracking = () => {
    const { user } = useAuth();
    const key = 'lastLessons';

    // Get storage key with user ID to prevent cross-user access
    const getStorageKey = useCallback((userId: string) => {
        return `${key}_${userId}`;
    }, []);

    // Get data from AsyncStorage
    const getData = useCallback(async (): Promise<
        Record<string, LastLesson>
    > => {
        if (!user?.id) {
            console.warn(
                'User not authenticated, cannot access last lesson data'
            );
            return {};
        }

        try {
            const storageKey = getStorageKey(user.id);
            const data = await getItem(storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Failed to get last lesson data:', error);
            return {};
        }
    }, [user?.id, getStorageKey]);

    // Set data to AsyncStorage
    const setData = useCallback(
        async (data: Record<string, LastLesson>): Promise<void> => {
            if (!user?.id) {
                console.warn(
                    'User not authenticated, cannot save last lesson data'
                );
                return;
            }

            try {
                const storageKey = getStorageKey(user.id);
                await setItem(storageKey, JSON.stringify(data));
            } catch (error) {
                console.error('Failed to save last lesson data:', error);
                throw error;
            }
        },
        [user?.id, getStorageKey]
    );

    // Set last lesson for a specific class
    const setLastLesson = useCallback(
        async (
            classId: string,
            folderId: string,
            materialId: string
        ): Promise<void> => {
            if (!user?.id) {
                console.warn('User not authenticated, cannot set last lesson');
                return;
            }

            try {
                const data = await getData();
                data[classId] = {
                    folder: folderId,
                    material: materialId,
                };
                await setData(data);
            } catch (error) {
                console.error('Failed to set last lesson:', error);
                throw error;
            }
        },
        [user?.id, getData, setData]
    );

    // Get last lesson for a specific class
    const getLastLesson = useCallback(
        async (classId: string): Promise<LastLesson | null> => {
            if (!user?.id) {
                console.warn('User not authenticated, cannot get last lesson');
                return null;
            }

            try {
                const data = await getData();
                return data[classId] || null;
            } catch (error) {
                console.error('Failed to get last lesson:', error);
                return null;
            }
        },
        [user?.id, getData]
    );

    // Remove last lesson for a specific class
    const removeLastLesson = useCallback(
        async (classId: string): Promise<void> => {
            if (!user?.id) {
                console.warn(
                    'User not authenticated, cannot remove last lesson'
                );
                return;
            }

            try {
                const data = await getData();
                delete data[classId];
                await setData(data);
            } catch (error) {
                console.error('Failed to remove last lesson:', error);
                throw error;
            }
        },
        [user?.id, getData, setData]
    );

    // Clear all last lessons for the current user
    const clearAll = useCallback(async (): Promise<void> => {
        if (!user?.id) {
            console.warn('User not authenticated, cannot clear last lessons');
            return;
        }

        try {
            const storageKey = getStorageKey(user.id);
            await removeItem(storageKey);
        } catch (error) {
            console.error('Failed to clear all last lessons:', error);
            throw error;
        }
    }, [user?.id, getStorageKey]);

    return {
        setLastLesson,
        getLastLesson,
        removeLastLesson,
        clearAll,
    };
};
