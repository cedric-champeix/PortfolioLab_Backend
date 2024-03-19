const prisma = require("../client")

module.exports = {
    getAllSkills: async (req, res) => {
        try {
            const user = req.user

            const skills = await prisma.skill.findMany({
                where: {
                    userId: user.id
                }
            })

            return res.status(200).json(skills)
        } catch (e) {
            return res.status(500).json({message: "Couldn't get skills."})
        }
    },

    getSkill: async (req, res) => {
        try {
            const skillId = req.params.skillId

            const skill = await prisma.skill.findUnique({
                where: {
                    id: skillId
                }
            })

            return res.status(200).json(skill)

        }catch (e) {
            return res.status(500).json({message: "Couldn't get skill."})
        }
    },

    createSkill: async (req, res) => {
        try {
            const data = req.body

            if (!("resumeId" in data)){
                data.Resume = {};
            }else {
                data.Resume = {connect: {id: data.resumeId}};
            }

            if (!("Projects" in data)){
                data.Projects = [];
            }

            const skill = await prisma.skill.create({
                data: {
                    name: data.name,
                    isSoft: data.isSoft,
                    Resume: data.Resume,
                    Projects: {
                        connect: data.Projects
                    },
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }
            })

            console.log("Created skill: ", skill)
            return res.status(200).json(skill)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create skill."})
        }
    },

    updateSkill: async (req, res) => {
        try {
            const data = req.body
            const skillId = req.params.skillId

            let valuesToModify = {}
            const acceptable_keys = ["name", "isSoft"]

            for (const key of acceptable_keys) {
                if (key in data)
                    valuesToModify[key] = data[key]
            }

            const skill = await prisma.skill.update({
                where: {
                    id: skillId,
                    userId: req.user.id
                },
                data: valuesToModify
            })

            console.log("Updated skill:", skill)
            return res.status(200).json(skill)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update skill."})
        }
    },

    deleteSkill: async (req, res) => {
        try {
            const skillId = req.params.skillId

            await prisma.skill.delete({
                where: {
                    id: skillId,
                    userId: req.user.id
                }
            })

            console.log(`Skill deleted: ${skillId}`)
            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete skill."})
        }
    },
}