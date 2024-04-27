const prisma = require("../../client")
const {exclude} = require("../../../utils/exclude");

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
                                Image: true,
                                User: true,
                            }

                        }
                }
            })

            resume.resume.User = exclude(resume.resume.User, ['pwd', 'id', 'role'])

            console.log(resume.resume)

            //console.log("Get resume: ", resume)
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
                    description: data.description,
                    title: data.title
                },
                include: {
                    Image: true
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

            console.log("Reset of ", req.user.username,"'s resume.")

            return res.status(200).json({message: "The resume was successfully reset."})
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't reset resume."})
        }
    },

    connectImage: async (req, res) => {
        try {
            const {imageId} = req.params

            console.log(imageId)

            await prisma.resume.update({
                where: {
                    userId: req.user.id
                },
                data: {
                    Image: {
                        connect: {id: imageId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't connect image."})
        }
    },

    disconnectImage: async (req, res) => {
        try {
            await prisma.resume.update({
                where: {
                    userId: req.user.id,
                },
                data: {
                    Image: {
                        disconnect: true
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't disconnect image."})
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
            console.error(e)
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
            console.error(e)
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
            console.error(e)
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
            console.error(e)
            return res.status(500).json({message: "Couldn't disconnect contact."})
        }
    },
    publish: async (req, res) => {
        try {
            const id = req.user.id
            //The goal is to retrieve the resume data and duplicate it into "resume.publishedData"
            //So we fetch the data, delete the attributes we do not want and feed the data into the published data

            const data =await prisma.resume.findUnique({
                where: {
                    userId: id
                },
                include: {
                    skills: true,
                    experiences: true,
                    formations: true,
                    hobbies: true,
                    languages: true,
                    contacts: true,
                    Image: true
                }
            })
            //We delete the unnecessary attributes
            delete(data.publishedData)
            delete(data.published)
            delete(data.userId)
            delete(data.id)
            //Updating the resume
            await prisma.resume.update({
                where:{
                    userId: id
                },
                data: {
                    published: true,
                    publishedData: data
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't publish the resume."})
        }
    },
    unpublish: async (req, res) => {
        try {
            const id = req.user.id
            //To unpublish, we delete the published data simply.
            await prisma.resume.update({
                where:{
                    userId: id
                },
                data: {
                    published: false,
                    publishedData: {}
                }
            })
            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't unpublish the resume."})
        }
    }
}

