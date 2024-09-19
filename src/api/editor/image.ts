import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../../service/auth/jwt';
import {
    addImage,
    deleteImage,
    deleteMultipleImages,
    getImages,
    updateImage,
} from '../../service/editor/image';
import { uploadImage } from '../../service/file_upload/upload';

const imageRouter = Router();

imageRouter
    .route('/images')
    .get(verifyAccessToken([Role.EDITOR]), getImages)
    .delete(verifyAccessToken([Role.EDITOR]), deleteMultipleImages);

imageRouter
    .route('/images/:imageId')
    .put(verifyAccessToken([Role.EDITOR]), updateImage)
    .delete(verifyAccessToken([Role.EDITOR]), deleteImage);

imageRouter
    .route('/images')
    .post(
        verifyAccessToken([Role.EDITOR]),
        uploadImage.single('image'),
        addImage
    );

export { imageRouter };
