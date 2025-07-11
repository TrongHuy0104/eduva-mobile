import { getUserProfile } from '@/api/user';
import { useAuth } from '@/contexts/auth.context';
import { User } from '@/types/models/user.model';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useUser = () => {
    const { isSignout } = useAuth();
    const { data, isPending } = useQuery<AxiosResponse<User | null>, Error>({
        queryKey: ['user'],
        queryFn: getUserProfile,
        enabled: !isSignout,
    });

    return { data: data?.data, isPending };
};
