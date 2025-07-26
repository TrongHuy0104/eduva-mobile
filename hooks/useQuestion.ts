import { createQuestion, deleteQuestion, getLessonQuestions, getMyQuestions, getQuestionById, updateQuestion } from "@/api/question";
import { useAuth } from "@/contexts/auth.context";
import { Question } from "@/types/models/question.model";
import { CreateQuestionRequest } from "@/types/requests/create-question.request";
import { GetQuestionsRequest } from "@/types/requests/get-questions-request.model";
import { UpdateQuestionRequest } from "@/types/requests/update-question.request";
import { BaseResponse } from "@/types/responses/base.response";
import { EntityListResponse } from "@/types/responses/entity-list-response.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useToast } from "./useToast";

export const useLessonQuestions = (materialId: string, request: GetQuestionsRequest) => {
    const { isSignout, user } = useAuth();
    
    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<EntityListResponse<Question>>>,
        Error
    >({
        queryKey: ['lesson-questions', materialId],
        queryFn: () => {
            return getLessonQuestions(materialId, request);
        },
        enabled: !isSignout && !!user?.id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });

    return {
        data: data?.data?.data?.data ?? [],
        totalCount: data?.data.data?.count ?? 0,
        isPending,
        error,
        refetch,
    };
};

export const useMyQuestions = (request: GetQuestionsRequest) => {
    const { isSignout, user } = useAuth();
    
    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<EntityListResponse<Question>>>,
        Error
    >({
        queryKey: ['my-questions', request],
        queryFn: () => {
            return getMyQuestions(request);
        },
        enabled: !isSignout && !!user?.id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });

    return {
        data: data?.data?.data?.data ?? [],
        totalCount: data?.data?.data?.count ?? 0,
        isPending,
        error,
        refetch,
    };
};

export const useQuestionById = (questionId: string, enabled: boolean = true) => {
    const { isSignout, user } = useAuth();
    
    const { data, isPending, error, refetch } = useQuery<
        AxiosResponse<BaseResponse<Question>>,
        Error
    >({
        queryKey: ['question', questionId],
        queryFn: () => {
            return getQuestionById(questionId);
        },
        enabled: enabled && !isSignout && !!user?.id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });

    return {
        data: data?.data?.data,
        isPending,
        error,
        refetch,
    };
};

export const useCreateQuestion = () => {
    
    const queryClient = useQueryClient();
    const toast = useToast();
   
    return useMutation<
        AxiosResponse<BaseResponse<Question>>,
        Error,
        CreateQuestionRequest
    >({
        mutationFn: (createQuestionRequest: CreateQuestionRequest) => {
            return createQuestion(createQuestionRequest);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-questions'] });
            queryClient.invalidateQueries({ queryKey: ['my-questions'] });
            toast.success(
                'Tạo câu hỏi thành công',
                'Câu hỏi của bạn đã được tạo thành công'
            );
        },
        onError: () => {
            toast.errorGeneral();
        },
    });
};

export const useUpdateQuestion = () => {
    
    const queryClient = useQueryClient();
    const toast = useToast();
    
    return useMutation<
    AxiosResponse<BaseResponse<Question>>,
    Error,
    { questionId: string; data: UpdateQuestionRequest }
>({
    mutationFn: ({ questionId, data }) => {
        return updateQuestion(questionId, data);
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['lesson-questions'] });
        queryClient.invalidateQueries({ queryKey: ['my-questions'] });
        queryClient.invalidateQueries({ queryKey: ['question', data.data.data?.id ?? ''] });
        toast.success(
            'Cập nhật câu hỏi thành công',
            'Câu hỏi của bạn đã được cập nhật thành công'
        );
    },
    onError: () => {
        toast.errorGeneral();
    },
});
};

export const useDeleteQuestion = () => {
    
    const queryClient = useQueryClient();
    const toast = useToast();
    
    return useMutation<
    AxiosResponse<BaseResponse<Question>>,
    Error,
    string
>({ 
    mutationFn: (questionId: string) => {
        return deleteQuestion(questionId);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lesson-questions'] });
        queryClient.invalidateQueries({ queryKey: ['my-questions'] });
        toast.success(
            'Xóa câu hỏi thành công',
            'Câu hỏi của bạn đã được xóa thành công'
        );
    },
    onError: () => {
        toast.errorGeneral();
    },
});
};