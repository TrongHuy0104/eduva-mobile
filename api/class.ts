import client from './client';

export const getStudentClassesEnrolled = () => {
    return client.get('/classes/enrollment');
};
