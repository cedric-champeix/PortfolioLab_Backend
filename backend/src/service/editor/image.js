const prisma = require("../client");
const {join} = require("path")
const fs = require("node:fs");

module.exports = {

    getImages: async (req, res) => {
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
    },

    addImage: async (req, res) => {
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
    },

    updateImage: async (req, res) => {
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
    },

    deleteImage: async (req, res) => {
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

            await fs.rm(path, (err) => {
                if (err) {
                    console.log("Couldn't delete image: ", err)
                }
            });

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete image."})
        }
    },

    deleteMultipleImages: async (req, res) => {
        try {
            const {body} = req

            const oldImages = await prisma.$transaction(async (tx) => {
                return Promise.all(body.imageIds.map(async (id) => {
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
    }

}