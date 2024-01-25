const prisma = require("../../client")

module.exports = {

    getAllProjects: async (req, res) => {
        try {
            const user = req.user

            let projects = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    projects: {
                        include: {
                            skills: true
                        }
                    }
                }
            })

            return res.status(200).json(projects)

        } catch (e) {
            return res.status(500).json({message: "Couldn't get projects."})
        }
    },

    getProject: async (req, res) => {
        try {
            const user = req.user
            const projectId = req.params.myProjectId

            let project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    userId: user.id
                },
                include: {
                    components: {
                        orderBy: {
                            index: 'asc'
                        }
                    },
                    skills: true
                }
            })

            return res.status(200).json(project)

        } catch (e) {
            console.error("Error when accessing project: ", e)

            return res.status(500).json({message: "Couldn't get project."})
        }
    },

    createProject: async (req, res) => {
        try {
            const data = req.body
            const user = req.user

            const project = await prisma.project.create({
                data: {
                    name: data.name,
                    description: data.description,
                    contributors: data.contributors,
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            return res.status(200).json(project)

        } catch (e) {
            return res.status(500).json({message: "Couldn't create project"})
        }
    },

    updateProject: async (req, res) => {
        try {
            const data = req.body
            const user = req.user
            const projectId = req.params.myProjectId

            const keys = ["name", "description", "contributors", "skills"]

            for (const key in keys) {
                if (!(key in data))
                    data[key] = null
            }

            await prisma.project.update({
                where: {
                    id: projectId,
                    userId: user.id
                },
                data: {
                    name: data.name,
                    description: data.description,
                    contributors: data.contributors,
                    skills: {
                        set: data.skills
                    }
                }
            })

            return res.status(200).json({message: "The project was updated successfully."})
        } catch (e) {
            return res.status(500).json({message: "Couldn't update project."})
        }
    },

    deleteProject: async (req, res) => {
        try {
            const user = req.user
            const projectId = req.params.myProjectId

            await prisma.project.delete({
                where: {
                    id: projectId,
                    userId: user.id
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            return res.status(500).json({message: "Couldn't delete project."})
        }
    },

    connectSkill: async (req, res) => {
        try {
            const {projectId, skillId} = req.params

            await prisma.project.update({
                where: {
                    id: projectId,
                    userId: req.user.id
                },
                data: {
                    skills: {
                        connect: {id: skillId}
                    }
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Couldn't connect skill."})
        }
    },

    disconnectSkill: async (req, res) => {
        try {
            const {projectId, skillId} = req.params

            await prisma.project.update({
                where: {
                    id: projectId,
                    userId: req.user.id
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
}