import {
    enrollClass,
    getStudentClassById,
    getStudentClassesEnrolled,
} from '@/api/class';
import { PAGE_SIZE } from '@/constants/app.constants';
import { StatusCode } from '@/constants/status-code.constant';
import { useAuth } from '@/contexts/auth.context';
import { EntityStatus } from '@/types/enums/entity-status.enum';
import { ClassModel } from '@/types/models/class.model';
import { GetStudentClassesEnrolledRequest } from '@/types/requests/get-student-classes-enrolled.request';
import { BaseResponse } from '@/types/responses/base.response';
import { EntityListResponse } from '@/types/responses/entity-list-response.model';
import {
    useInfiniteQuery,
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useToast } from './useToast';

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
                studentId: user?.id ?? '',
                classStatus: params.classStatus ?? EntityStatus.Active,
                schoolId: user?.school?.id ?? 0,
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
                studentId: user?.id ?? '',
                classStatus: params.classStatus ?? EntityStatus.Active,
                schoolId: user?.school?.id ?? 0,
                sortBy: params.sortBy ?? 'enrolledAt',
                sortDirection: params.sortDirection ?? 'desc',
                pageIndex: pageParam + 1,
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

export const useStudentClassById = (classId: string) => {
    const { isSignout, user } = useAuth();

    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<ClassModel>>,
        Error
    >({
        queryKey: ['class', classId],
        queryFn: () => getStudentClassById(classId),
        enabled: !isSignout && !!user?.id,
    });

    return {
        data: data?.data?.data,
        isPending,
        error,
        refetch,
    };
};

export const useEnrollClass = (): UseMutationResult<
    AxiosResponse<BaseResponse<ClassModel>>,
    AxiosError<BaseResponse>,
    string
> => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation<
        AxiosResponse<BaseResponse<ClassModel>>,
        AxiosError<BaseResponse>,
        string
    >({
        mutationFn: (classCode: string) => enrollClass(classCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
        onError: (res) => {
            const statusCode = res.response?.data.statusCode;

            queryClient.removeQueries({ queryKey: ['classes'] });

            switch (statusCode) {
                case StatusCode.CLASS_NOT_FOUND:
                    toast.error(
                        'Tham gia lớp học thất bại',
                        'Mã lớp không tồn tại.'
                    );
                    break;
                case StatusCode.CLASS_CODE_DUPLICATE:
                    toast.error(
                        'Tham gia lớp học thất bại',
                        'Mã lớp đã tồn tại trong hệ thống.'
                    );
                    break;
                case StatusCode.STUDENT_CANNOT_ENROLL_DIFFERENT_SCHOOL:
                    toast.error(
                        'Tham gia lớp học thất bại',
                        'Bạn không thể tham gia lớp học khác trường.'
                    );
                    break;
                case StatusCode.STUDENT_ALREADY_ENROLLED:
                    toast.error(
                        'Tham gia lớp học thất bại',
                        'Bạn đã tham gia lớp học này.'
                    );
                    break;
                case StatusCode.CLASS_NOT_ACTIVE:
                    toast.error(
                        'Tham gia lớp học thất bại',
                        'Lớp học hiện chưa được kích hoạt'
                    );
                    break;

                default:
                    toast.errorGeneral();
            }
        },
    });
};
