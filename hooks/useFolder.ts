import { getClassFolders, getFolderById } from '@/api/folder';
import { useAuth } from '@/contexts/auth.context';
import { FolderOwnerType } from '@/types/enums/folder-owner-type.enum';
import { Folder } from '@/types/models/folder.model';
import { GetFoldersRequest } from '@/types/requests/get-folders.request';
import { BaseResponse } from '@/types/responses/base.response';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UseFolderParams {
    ownerType?: FolderOwnerType;
}

export const useFolders = (classId: string, params: UseFolderParams = {}) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<Folder[]>>,
        Error
    >({
        queryKey: ['folders', params, classId],
        queryFn: () => {
            const request: GetFoldersRequest = {
                ownerType: params.ownerType ?? FolderOwnerType.Class,
            };

            return getClassFolders(request, classId);
        },
        enabled: !isSignout && !!user?.id,
    });

    return {
        data: data?.data?.data ?? [],
        isPending,
        error,
        refetch,
    };
};

export const useFolderById = (folderId: string) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<Folder>>,
        Error
    >({
        queryKey: ['folder', folderId],
        queryFn: () => getFolderById(folderId),
        enabled: !isSignout && !!user?.id,
    });

    return {
        data: data?.data?.data,
        isPending,
        error,
        refetch,
    };
};
