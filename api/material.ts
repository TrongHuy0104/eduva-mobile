import { GetLessonMaterialsRequest } from '@/types/requests/get-lesson-materials.request';
import client from './client';

export const getLessonMaterialsInFolder = (
    getLessonMaterialsRequest: GetLessonMaterialsRequest,
    folderId: string
) => {
    return client.get(`/folders/${folderId}/lesson-materials`, {
        params: getLessonMaterialsRequest,
    });
};

export const getLessonMaterialById = (id: string) => {
    return client.get(`/lesson-materials/${id}`);
};
