const prisma = require("../client")

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
                                socials: true,
                                experiences: true,
                                formations: true
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

            let valuesToModify = {}
            const acceptable_keys = ["description", "languages", "hobbies"]

            for (const key of acceptable_keys) {
                if (key in data)
                    valuesToModify[key] = data[key]
            }

            const update = await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: valuesToModify
            })

            return res.status(200).json({message: "The resume was updated successfully."})
        } catch (e) {
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
            const socialId = req.params.socialId

            await prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    socials: {
                        connect: {id: socialId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't connect social media."})
        }
    },

    disconnectSocial: async (req, res) => {
        try {
            const user = req.user
            const socialId = req.params.socialId

            await prisma.resume.update({
                where: {
                    userId: user.id,
                },
                data: {
                    socials: {
                        disconnect: {id: socialId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't disconnect social media."})
        }
    }
}