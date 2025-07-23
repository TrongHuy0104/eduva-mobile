import { EntityStatus } from '@/types/enums/entity-status.enum';
import { LessonMaterialStatus } from '@/types/enums/lesson-material.enum';
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

export const getAllFoldersAndLessonMaterials = (classId: string) => {
    return client.get(`/classes/${classId}/lesson-materials`, {
        params: {
            lessonStatus: LessonMaterialStatus.Approved,
            status: EntityStatus.Active,
        },
    });
};
