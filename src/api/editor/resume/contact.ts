import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../../../service/auth/jwt';
import {
    createContact,
    deleteContact,
    getAllContacts,
    getContact,
    updateContact,
} from '../../../service/editor/contact';

const contactRouter = Router();

contactRouter
    .route('/contacts')
    .get(verifyAccessToken([Role.EDITOR]), getAllContacts)
    .post(verifyAccessToken([Role.EDITOR]), createContact);

contactRouter
    .route('/contacts/:contactId')
    .get(verifyAccessToken([Role.EDITOR]), getContact)
    .put(verifyAccessToken([Role.EDITOR]), updateContact)
    .delete(verifyAccessToken([Role.EDITOR]), deleteContact);

export { contactRouter };
