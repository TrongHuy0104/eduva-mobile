import { getStudentClassesEnrolled } from '@/api/class';
import { useAuth } from '@/contexts/auth.context';
import { ClassModel } from '@/types/models/class.model';
import { BaseResponse } from '@/types/responses/base.response';
import { EntityListResponse } from '@/types/responses/entity-list-response.model';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useClass = () => {
    const { isSignout } = useAuth();
    const { data, isPending, error } = useQuery<
        AxiosResponse<BaseResponse<EntityListResponse<ClassModel>>>,
        Error
    >({
        queryKey: ['classes'],
        queryFn: getStudentClassesEnrolled,
        enabled: !isSignout,
    });

    return { data: data?.data.data?.data ?? [], isPending, error };
};
