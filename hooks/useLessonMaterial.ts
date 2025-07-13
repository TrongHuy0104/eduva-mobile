import {
    getLessonMaterialById,
    getLessonMaterialsInFolder,
} from '@/api/material';
import { useAuth } from '@/contexts/auth.context';
import { LessonMaterialStatus } from '@/types/enums/lesson-material.enum';
import { LessonMaterial } from '@/types/models/lesson-material.model';
import { GetLessonMaterialsRequest } from '@/types/requests/get-lesson-materials.request';
import { BaseResponse } from '@/types/responses/base.response';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useLessonMaterials = (
    folderId: string,
    params: GetLessonMaterialsRequest,
    enabled: boolean = true
) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<LessonMaterial[]>>,
        Error
    >({
        queryKey: ['lesson-materials', folderId, params],
        queryFn: () => {
            const request: GetLessonMaterialsRequest = {
                ...params,
                folderId,
                lessonStatus: LessonMaterialStatus.Approved,
                sortBy: 'lastmodifiedat',
                sortDirection: 'asc',
            };

            return getLessonMaterialsInFolder(request, folderId);
        },
        enabled: enabled && !isSignout && !!user?.id,
    });

    return {
        data: data?.data?.data ?? [],
        isPending,
        error,
        refetch,
    };
};

export const useLessonMaterialById = (
    materialId: string,
    enabled: boolean = true
) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<LessonMaterial>>,
        Error
    >({
        queryKey: ['lesson-material', materialId],
        queryFn: () => getLessonMaterialById(materialId),
        enabled: !isSignout && !!user?.id && enabled,
    });

    return {
        data: data?.data?.data,
        isPending,
        error,
        refetch,
    };
};
