import { EmailLinkRequest } from '@/types/requests/email-link.request';
import client from './client';

export const resendConfirmEmail = (req: EmailLinkRequest) => {
    return client.post('/auth/resend-confirmation-email', req);
};
