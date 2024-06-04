const prisma = require("../../client")

module.exports = {
    getAllExperience: async (req, res) => {
        try {
            const user = req.user

            const experiences = await prisma.experience.findMany({
                where: {
                    userId: user.id
                }
            })
            console.log(experiences)
            return res.status(200).json(experiences)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get experiences."})
        }
    },

    getExperience: async (req, res) => {
        try {
            const experienceId = req.params.experienceId

            const experience = await prisma.experience.findUnique({
                where: {
                    id: experienceId
                }
            })

            return res.status(200).json(experience)

        }catch (e) {
            return res.status(500).json({message: "Couldn't get experience."})
        }
    },

    createExperience: async (req, res) => {
        try {
            const data = req.body

            const experience = await prisma.experience.create({
                data: {
                    title: data.title,
                    company: data.company,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    Resume: {
                        connect: {
                            id: data.resumeId
                        }
                    },
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }
            })

            console.log("Created experience: ", experience)
            return res.status(200).json(experience)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create experience."})
        }
    },

    updateExperience: async (req, res) => {
        try {
            const data = req.body
            const user = req.user
            const experienceId = req.params.experienceId

            let valuesToModify = {}
            const acceptable_keys = ["title", "company", "description", "startDate", "endDate"]

            for (const key of acceptable_keys) {
                if (key in data)
                    valuesToModify[key] = data[key]
            }

            const experience = await prisma.experience.update({
                where: {
                    id: experienceId,
                    userId: user.id
                },
                data: valuesToModify
            })

            console.log("Updated experience:", experience)
            return res.status(200).json(experience)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update experience."})
        }
    },

    deleteExperience: async (req, res) => {
        try {
            const experienceId = req.params.experienceId

            await prisma.experience.delete({
                where: {
                    id: experienceId,
                    userId: req.user.id
                }
            })

            console.log(`Experience deleted: ${experienceId}`)
            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete experience."})
        }
    },
}