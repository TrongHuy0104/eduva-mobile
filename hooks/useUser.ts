import { getUserProfile, updateProfile } from '@/api/user';
import { useAuth } from '@/contexts/auth.context';
import { User } from '@/types/models/user.model';
import { UpdateProfileRequest } from '@/types/requests/update-profile.request';
import { BaseResponse } from '@/types/responses/base.response';
import {
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useToast } from './useToast';

export const useUser = () => {
    const { isSignout } = useAuth();
    const { data, isPending, refetch } = useQuery<
        AxiosResponse<User | null>,
        Error
    >({
        queryKey: ['user'],
        queryFn: getUserProfile,
        enabled: !isSignout,
    });

    return { data: data?.data, isPending, refetch };
};

export const useUpdateProfile = (): UseMutationResult<
    AxiosResponse<BaseResponse<User>>,
    AxiosError<BaseResponse>,
    UpdateProfileRequest
> => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation<
        AxiosResponse<BaseResponse<User>>,
        AxiosError<BaseResponse>,
        UpdateProfileRequest
    >({
        mutationFn: (req: UpdateProfileRequest) => updateProfile(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success(
                'Cập nhật thông tin thành công',
                'Hồ sơ của bạn đã được thay đổi thành công'
            );
        },
        onError: () => {
            toast.errorGeneral();
        },
    });
};
