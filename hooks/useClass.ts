import { getStudentClassesEnrolled } from '@/api/class';
import { PAGE_SIZE } from '@/constants/app.constants';
import { useAuth } from '@/contexts/auth.context';
import { EntityStatus } from '@/types/enums/entity-status.enum';
import { ClassModel } from '@/types/models/class.model';
import { GetStudentClassesEnrolledRequest } from '@/types/requests/get-student-classes-enrolled-request.model';
import { BaseResponse } from '@/types/responses/base.response';
import { EntityListResponse } from '@/types/responses/entity-list-response.model';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UseClassParams {
    pageIndex?: number;
    pageSize?: number;
    searchTerm?: string;
    classStatus?: EntityStatus;
    sortBy?: string;
    sortDirection?: string;
}

export const useClass = (params: UseClassParams = {}) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<EntityListResponse<ClassModel>>>,
        Error
    >({
        queryKey: ['classes', params],
        queryFn: () => {
            const request: GetStudentClassesEnrolledRequest = {
                studentId: user?.id || '',
                classStatus: params.classStatus ?? EntityStatus.Active,
                schoolId: user?.school?.id || 0,
                sortBy: params.sortBy ?? 'enrolledAt',
                sortDirection: params.sortDirection ?? 'desc',
                pageIndex: (params.pageIndex ?? 0) + 1,
                pageSize: params.pageSize ?? PAGE_SIZE,
            };

            return getStudentClassesEnrolled(request);
        },
        enabled: !isSignout && !!user?.id,
    });

    return {
        data: data?.data?.data?.data ?? [],
        isPending,
        error,
        refetch,
        totalCount: data?.data?.data?.count ?? 0,
    };
};

export const useInfiniteClass = (
    params: Omit<UseClassParams, 'pageIndex'> = {}
) => {
    const { isSignout, user } = useAuth();

    const {
        data,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['infinite-classes', params],
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const request: GetStudentClassesEnrolledRequest = {
                studentId: user?.id || '',
                classStatus: params.classStatus ?? EntityStatus.Active,
                schoolId: user?.school?.id || 0,
                sortBy: params.sortBy ?? 'enrolledAt',
                sortDirection: params.sortDirection ?? 'desc',
                pageIndex: (pageParam as number) + 1,
                pageSize: params.pageSize ?? PAGE_SIZE,
            };

            return getStudentClassesEnrolled(request);
        },
        getNextPageParam: (lastPage, allPages) => {
            const currentCount =
                allPages.length * (params.pageSize ?? PAGE_SIZE);
            const totalCount = lastPage?.data?.data?.count ?? 0;

            return currentCount < totalCount ? allPages.length : undefined;
        },
        enabled: !isSignout && !!user?.id,
    });

    // Flatten all pages into a single array
    const allClasses =
        data?.pages.flatMap((page: any) => page?.data?.data?.data ?? []) ?? [];
    const totalCount = data?.pages[0]?.data?.data?.count ?? 0;

    return {
        data: allClasses,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        totalCount,
    };
};
