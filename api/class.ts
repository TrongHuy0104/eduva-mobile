import { GetStudentClassesEnrolledRequest } from '@/types/requests/get-student-classes-enrolled-request.model';
import client from './client';

export const getStudentClassesEnrolled = (
    getStudentClassesEnrolledRequest: GetStudentClassesEnrolledRequest
) => {
    return client.get('/classes/enrollment', {
        params: getStudentClassesEnrolledRequest,
    });
};
