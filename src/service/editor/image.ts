import {Request, Response} from "express";
import {join} from "path";
import fs from "node:fs";
import {prisma} from "../client";


const getImages = async (req: Request, res: Response) => {
    try {
        const images = await prisma.image.findMany({
            where: {
                userId: req.user.id
            }
        })

        return res.status(200).json(images)
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't get images."})
    }
};

const addImage = async (req: Request, res: Response) => {
    try {
        const file = req.file
        const body = JSON.parse(req.body.data)

        if (!file) {
            throw new Error("No file provided when adding new image.")
        }

        const publicFolderIndex = file.path.search(/public[/+\\]/g)
        if (publicFolderIndex === -1) {
            throw new Error("Path doesn't contain /public")
        }

        const relativePath = file.path.substring(publicFolderIndex)

        console.log(body)
        const image = await prisma.image.create({
            data: {
                name: body.name,
                path: relativePath,
                Resume: body.resumeId ? {
                    connect: {id: body.resumeId}
                } : undefined,
                Project: body.projectId ? {
                    connect: {id: body.projectId}
                } : undefined,
                User: {
                    connect: {id: req.user.id}
                }
            }
        })

        return res.status(200).json(image)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't add image."})
    }
};

const updateImage = async (req: Request, res: Response) => {
    try {
        const {body} = req
        const {imageId} = req.params

        const image = await prisma.image.update({
            where: {
                id: imageId,
                userId: req.user.id
            },
            data: {
                name: body.name
            }
        })

        return res.status(200).json(image)
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't update image."})
    }
};

const deleteImage = async (req: Request, res: Response) => {
    try {
        const {imageId} = req.params

        const oldImage = await prisma.image.delete({
            where: {
                id: imageId,
                userId: req.user.id
            },
            select: {
                path: true
            }
        })

        const path = join(process.cwd(), oldImage.path)

        fs.rm(path, (err) => {
            if (err) {
                console.log("Couldn't delete image: ", err)
            }
        });

        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't delete image."})
    }
};

const deleteMultipleImages = async (req: Request, res: Response) => {
    try {
        const {body} = req

        const oldImages = await prisma.$transaction(async (tx) => {
            return Promise.all(body.imageIds.map(async (id: string) => {
                return tx.image.delete({
                    where: {
                        id: id,
                        userId: req.user.id
                    },
                    select: {
                        path: true
                    }
                })
            }))
        })

        await Promise.all(oldImages.map((image) => {
            const path = join(process.cwd(), image.path)
            return fs.promises.rm(path);
        }))

        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't delete images."})
    }
};

export {getImages, addImage, updateImage, deleteImage, deleteMultipleImages}