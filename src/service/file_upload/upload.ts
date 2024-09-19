import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'node:fs';
import { extname, join } from 'path';
import { v4 } from 'uuid';

const imageFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'));
    }
};

const editorDestination = async (username: string) => {
    const projectFolder = join(process.cwd(), '/public/editors', username);

    if (!fs.existsSync(projectFolder)) {
        await fs.promises.mkdir(projectFolder, { recursive: true });
    }

    return projectFolder;
};

const fileSize1Mo = 1048576;

export const uploadImage = multer({
    storage: multer.diskStorage({
        destination: async (req: Request, file: Express.Multer.File, cb) => {
            const dest = await editorDestination(req.user.username);
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            cb(null, v4() + extname(file.originalname));
        },
    }),
    fileFilter: imageFilter,
    limits: { fileSize: fileSize1Mo * 10 },
});
