import { GetStudentClassesEnrolledRequest } from '@/types/requests/get-student-classes-enrolled.request';
import client from './client';

export const getStudentClassesEnrolled = (
    getStudentClassesEnrolledRequest: GetStudentClassesEnrolledRequest
) => {
    return client.get('/classes/enrollment', {
        params: getStudentClassesEnrolledRequest,
    });
};

export const getStudentClassById = (classId: string) => {
    return client.get(`/classes/${classId}`);
};

export const enrollClass = (classCode: string) => {
    return client.post('/classes/enroll-by-code', {
        classCode,
    });
};
