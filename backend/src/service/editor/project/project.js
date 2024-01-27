const prisma = require("../../client")
const {join} = require("path")
const fs = require("node:fs/promises")

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
            const {body, user, file} = req.body

            let relativePath = ""
            if (file) {
                const publicFolderIndex = file.path.indexOf("public/");

                if (publicFolderIndex === -1) {
                    throw new Error("Path doesn't contain /public")
                }

                relativePath = file.path.substring(publicFolderIndex);
            }


            const project = await prisma.project.create({
                data: {
                    name: body.name,
                    description: body.description,
                    contributors: body.contributors,
                    mainImgURL: relativePath,
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
            const {body, user, file} = req.body
            const projectId = req.params.myProjectId

            if (!file) {
                const project = await prisma.project.update({
                    where: {
                        id: projectId,
                        userId: user.id
                    },
                    data: {
                        name: body.name,
                        description: body.description,
                        contributors: body.contributors
                    }
                })

                return res.status(200).json(project)
            }

            const publicFolderIndex = file.path.indexOf("public/");

            if (publicFolderIndex === -1) {
                throw new Error("Path doesn't contain /public")
            }

            const relativePath = file.path.substring(publicFolderIndex);

            const getOldProject = prisma.project.findUnique({
                where: {
                    id: projectId,
                    userId: user.id
                },
                select: {
                    mainImgURL: true
                }
            })

            const updateProject = prisma.project.update({
                where: {
                    id: projectId,
                    userId: user.id
                },
                data: {
                    name: body.name,
                    description: body.description,
                    contributors: body.contributors,
                    mainImgURL: relativePath
                }
            })

            const [oldProject, project] = prisma.$transaction([getOldProject, updateProject])

            if (oldProject.mainImgURL)
                await fs.rm(join(process.cwd(), oldProject.mainImgURL))

            return res.status(200).json(project)

        } catch (e) {
            return res.status(500).json({message: "Couldn't update project."})
        }
    },

    deleteProject: async (req, res) => {
        try {
            const user = req.user
            const projectId = req.params.myProjectId

            const oldProject = await prisma.project.delete({
                where: {
                    id: projectId,
                    userId: user.id
                },
                select: {
                    mainImgURL: true
                }
            })

            if (oldProject.mainImgURL)
                await fs.rm(join(process.cwd(), oldProject.mainImgURL))

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