import { CreateQuestionRequest } from "@/types/requests/create-question.request";
import { GetQuestionsRequest } from "@/types/requests/get-questions-request.model";
import { UpdateQuestionRequest } from "@/types/requests/update-question.request";
import client from "./client";

export const getLessonQuestions = (materialId: string, getQuestionsRequest: GetQuestionsRequest) => {
    return client.get(`/questions/lesson/${materialId}`, {
        params: getQuestionsRequest,
    });
};

export const getMyQuestions = (getQuestionsRequest: GetQuestionsRequest) => {
    return client.get(`/questions/my-questions`, {
        params: getQuestionsRequest,
    });
};

export const getQuestionById = (questionId: string) => {
    return client.get(`/questions/${questionId}`);
};

export const createQuestion = (createQuestionRequest: CreateQuestionRequest) => {
    return client.post(`/questions`, createQuestionRequest);
};

export const updateQuestion = (questionId: string, updateQuestionRequest: UpdateQuestionRequest) => {
    return client.put(`/questions/${questionId}`, updateQuestionRequest);
};

export const deleteQuestion = (questionId: string) => {
    return client.delete(`/questions/${questionId}`);
};
