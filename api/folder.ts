import { GetFoldersRequest } from '@/types/requests/get-folders.request';
import client from './client';

export const getClassFolders = (
    getFoldersRequest: GetFoldersRequest,
    classId: string
) => {
    return client.get(`/folders/class/${classId}`, {
        params: getFoldersRequest,
    });
};

export const getFolderById = (folderId: string) => {
    return client.get(`/folders/${folderId}`);
};
