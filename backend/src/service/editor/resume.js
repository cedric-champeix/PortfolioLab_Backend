const prisma = require("../client")
const {join} = require("path")
const fs = require("node:fs/promises")

module.exports = {
    getResume: async (req, res) => {
        try {
            const user = req.user

            const resume = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    resume:
                        {
                            include: {
                                skills: true,
                                contacts: true,
                                experiences: true,
                                formations: true,
                                languages: true,
                                hobbies: true
                            }
                        }
                }
            })

            console.log("Get resume: ", resume.resume)
            return res.status(200).json(resume.resume)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get resume."})
        }
    },

    updateResume: async (req, res) => {
        try {
            const data = req.body
            const user = req.user

            const resume = await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    description: data.description
                }
            })

            console.log("Update resume:", resume)

            return res.status(200).json(resume)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update resume."})
        }
    },

    resetResume: async (req, res) => {
        try {
            const user = req.user

            const deleteResume = prisma.resume.delete({
                where: {
                    userId: user.id
                }
            })

            const createResume = prisma.resume.create({
                data: {
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            await prisma.$transaction([deleteResume, createResume])

            return res.status(200).json({message: "The resume was successfully reset."})
        } catch (e) {
            return res.status(500).json({message: "Couldn't reset resume."})
        }
    },

    uploadImage: async (req, res) => {
        try {
            const user = req.user
            const file = req.file

            if(!file) {
                throw new Error("No file provided.")
            }

            const publicIndex = file.path.indexOf("public/");

            if (publicIndex === -1) {
                throw new Error("Path doesn't contain /public")
            }

            const relativePath = file.path.substring(publicIndex);

            console.log(relativePath)

            const resume = await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    image: relativePath
                }
            })

            return res.status(200).json(resume)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't upload image"})
        }
    },

    deleteImage: async (req, res) => {
        try {
            const user = req.user

            const resume = await prisma.resume.findUnique({
                where: {
                    userId: user.id
                }
            })

            if (!resume.image) {
                return res.status(400).json({error: "The resume doesn't have any image."})
            }

            await fs.rm(join(process.cwd(), resume.image))

            const updatedResume = await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    image: null
                }
            })

            return res.status(200).json(updatedResume)

        } catch (e) {
            console.error(e)
            return res.status(500).json({error: "Couldn't delete image"})
        }
    },

    connectSkill: async (req, res) => {
        try {
            const user = req.user
            const skillId = req.params.skillId

            await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    skills: {
                        connect: {id: skillId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't connect skill."})
        }
    },

    disconnectSkill: async (req, res) => {
        try {
            const user = req.user
            const skillId = req.params.skillId

            await prisma.resume.update({
                where: {
                    userId: user.id,
                },
                data: {
                    skills: {
                        disconnect: {id: skillId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't disconnect skill."})
        }
    },

    connectSocial: async (req, res) => {
        try {
            const user = req.user
            const contactId = req.params.contactId

            await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    contacts: {
                        connect: {id: contactId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't connect contact."})
        }
    },

    disconnectSocial: async (req, res) => {
        try {
            const user = req.user
            const contactId = req.params.contactId

            await prisma.resume.update({
                where: {
                    userId: user.id,
                },
                data: {
                    contacts: {
                        disconnect: {id: contactId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't disconnect contact."})
        }
    }
}