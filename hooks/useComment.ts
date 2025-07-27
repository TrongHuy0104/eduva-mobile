import { createComment, deleteComment, updateComment } from "@/api/comment";
import { CommentEntity } from "@/types/models/comment.model";
import { CreateCommentRequest } from "@/types/requests/create-comment-request.model";
import { UpdateCommentRequest } from "@/types/requests/update-comment-request.model";
import { BaseResponse } from "@/types/responses/base.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useToast } from "./useToast";

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    const toast = useToast();
   
    return useMutation<
        AxiosResponse<BaseResponse<CommentEntity>>,
        Error,
        CreateCommentRequest
    >({
        mutationFn: (createCommentRequest: CreateCommentRequest) => {
            return createComment(createCommentRequest);
        },
        onSuccess: (response) => {
            if (!response.data.data) return;
            queryClient.invalidateQueries({ queryKey: ['question', response.data.data.questionId] });
            toast.success(
                'Tạo bình luận thành công',
                'Bình luận của bạn đã được tạo thành công'
            );
        },
        onError: () => {
            toast.errorGeneral();
        },
    });
}

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    const toast = useToast();
   
    return useMutation<
        AxiosResponse<BaseResponse<CommentEntity>>,
        Error,
        { commentId: string; data: UpdateCommentRequest }
    >({
        mutationFn: ({ commentId, data }) => {
            return updateComment(commentId, data);
        },
        onSuccess: (response) => {
            if (!response.data.data) return;
            queryClient.invalidateQueries({ queryKey: ['question', response.data.data.questionId] });
            toast.success(
                'Cập nhật bình luận thành công',
                'Bình luận của bạn đã được cập nhật thành công'
            );
        },
        onError: () => {
            toast.errorGeneral();
        },
    });
}

interface DeleteCommentContext {
    previousQuestion: any;
}

const removeCommentFromCache = (data: any, commentId: string) => {
    if (!data) return data;
    
    const updatedComments = data.comments.filter(
        (comment: CommentEntity) => comment.id !== commentId
    );
    
    updatedComments.forEach((comment: CommentEntity) => {
        if (comment.replies) {
            comment.replies = comment.replies.filter(
                (reply: any) => reply.id !== commentId
            );
        }
    });
    
    return {
        ...data,
        comments: updatedComments,
        totalComments: data.totalComments - 1
    };
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    const toast = useToast();
   
    const handleDeleteComment = (commentId: string) => deleteComment(commentId);
    
    const handleMutate = async (commentId: string) => {
        await queryClient.cancelQueries({ queryKey: ['question'] });
        const previousQuestion = queryClient.getQueryData(['question']);
        
        queryClient.setQueryData(['question'], (old: any) => 
            removeCommentFromCache(old, commentId)
        );
        
        return { previousQuestion };
    };
    
    return useMutation<
        AxiosResponse<BaseResponse<CommentEntity>>,
        Error,
        string,
        DeleteCommentContext
    >({
        mutationFn: handleDeleteComment,
        onMutate: handleMutate,
        onSuccess: (response) => {
            if (!response.data.data) return;
            
            // Invalidate and refetch
            queryClient.invalidateQueries({ 
                queryKey: ['question', response.data.data.questionId],
                refetchType: 'active',
            });
            
            toast.success(
                'Xóa bình luận thành công',
                'Bình luận của bạn đã được xóa thành công'
            );
            
            // The scroll-to-top is now handled by the parent component
        },
        onError: (error, commentId, context) => {
            // Rollback on error
            if (context?.previousQuestion) {
                queryClient.setQueryData(['question'], context.previousQuestion);
            }
            toast.errorGeneral();
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['question'] });
        },
    });
}
