const prisma = require("../client")

module.exports = {
    getResume: async (req, res) => {
        try {
            const user = req.user

            let resume = await prisma.user.findUnique({
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

            return res.status(200).json(resume)

        } catch (e) {
            return res.status(500).json({message: "Couldn't get resume."})
        }
    },

    updateResume: async (req, res) => {
        try {
            const resume = req.body
            const user = req.user

            const keys = ["description", "languages", "hobbies", "formations", "experiences", "skills", "socials"]

            for (const key in keys) {
                if (!(key in resume))
                    resume[key] = null
            }

            const deleteRelatedRecords = prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    formations: {
                        deleteMany: {}
                    },
                    experiences: {
                        deleteMany: {}
                    }
                },
                include: {
                    formations: true,
                    experiences: true,
                }
            })

            const update = prisma.resume.update({
                where: {
                    userId: user.id
                },
                data: {
                    description: resume.description,
                    languages: resume.languages,
                    hobbies: resume.hobbies,
                    formations: {
                        create: resume.formations
                    },
                    experiences: {
                        create: resume.experiences
                    },
                    skills: {
                        set: resume.skills
                    },
                    socials: {
                        set: resume.socials
                    }
                }
            })

            await prisma.$transaction([deleteRelatedRecords, update])

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
    }
}