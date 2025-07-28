import { CreateCommentRequest } from "@/types/requests/create-comment-request.model";
import { UpdateCommentRequest } from "@/types/requests/update-comment-request.model";
import client from "./client";

export const createComment = async (data: CreateCommentRequest) => {
    return client.post('/questions/comments', data);
}

export const updateComment = async (commentId: string, data: UpdateCommentRequest) => {
    return client.put(`/questions/comments/${commentId}`, data);
}

export const deleteComment = async (commentId: string) => {
    return client.delete(`/questions/comments/${commentId}`);
}
