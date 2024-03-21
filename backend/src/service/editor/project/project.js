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
                            MainImage: true,
                            skills: true
                        }
                    }
                }
            })

            return res.status(200).json(projects)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get projects."})
        }
    },

    getProject: async (req, res) => {
        try {
            const user = req.user
            const {myProjectId} = req.params

            let project = await prisma.project.findUnique({
                where: {
                    id: myProjectId,
                    userId: user.id
                },
                include: {
                    components: {
                        orderBy: {
                            index: "asc"
                        }
                    },
                    skills: true,
                    MainImage: true,
                    ProjectImages: true
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
            const {user} = req
            const body = req.body

            const project = await prisma.project.create({
                data: {
                    name: body.name,
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            return res.status(200).json(project)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create project."})
        }
    },

    updateProject: async (req, res) => {
        try {
            const {user} = req
            const {myProjectId} = req.params
            const body = req.body

            const project = await prisma.project.update({
                where: {
                    id: myProjectId,
                    userId: user.id
                },
                data: {
                    name: body.name,
                    description: body.description,
                    contributors: body.contributors
                },
                include: {
                    skills: true,
                    MainImage: true,
                    ProjectImages: true,
                    components: {
                        orderBy: {
                            index: "asc"
                        }
                    },
                }
            })

            return res.status(200).json(project)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update project."})
        }
    },

    deleteProject: async (req, res) => {
        try {
            const user = req.user
            const {myProjectId} = req.params

            await prisma.project.delete({
                where: {
                    id: myProjectId,
                    userId: user.id
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete project."})
        }
    },

    connectSkill: async (req, res) => {
        try {
            const {myProjectId, skillId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
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
            console.error(e)
            return res.status(500).json({message: "Couldn't connect skill."})
        }
    },

    disconnectSkill: async (req, res) => {
        try {
            const {myProjectId, skillId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
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
            console.error(e)
            return res.status(500).json({message: "Couldn't disconnect skill."})
        }
    },

    connectMainImage: async (req, res) => {
        try {
            const {myProjectId, imageId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
                    userId: req.user.id
                },
                data: {
                    MainImage: {
                        connect: {id: imageId}
                    }
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't connect main image."})
        }
    },

    disconnectMainImage: async (req, res) => {
        try {
            const {myProjectId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
                    userId: req.user.id
                },
                data: {
                    MainImage: {
                        disconnect: true
                    }
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't disconnect main image."})
        }
    },

    connectProjectImage: async (req, res) => {
        try {
            const {myProjectId, imageId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
                    userId: req.user.id
                },
                data: {
                    ProjectImages: {
                        connect: [{id: imageId}]
                    }
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't connect image."})
        }
    },

    disconnectProjectImage: async (req, res) => {
        try {
            const {myProjectId, imageId} = req.params

            await prisma.project.update({
                where: {
                    id: myProjectId,
                    userId: req.user.id
                },
                data: {
                    ProjectImages: {
                        disconnect: {
                            id: imageId
                        }
                    }
                }
            })

            return res.sendStatus(200)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't disconnect image."})
        }
    },

    publish: async (req, res) => {
        try {
            const {myProjectId} = req.params
            const {user} = req

            const publish = await prisma.project.update({
                where: {
                    userId: user.id,
                    id: myProjectId
                }, data: {
                    published: true
                }
            })
            return res.status(200).json(publish)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update project."})
        }
    },

    unpublish: async (req, res) => {
        try {
            const {myProjectId} = req.params
            const {user} = req

            const publish = await prisma.project.update({
                where: {
                    userId: user.id,
                    id: myProjectId
                }, data: {
                    published: false
                }
            })
            return res.status(200).json(publish)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update project."})
        }
    }
}