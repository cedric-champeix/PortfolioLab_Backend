const prisma = require("../../client")

const MIN_DISTANCE = 3
const MAX_DISTANCE = 10

const updateComponentsIndex = async (projectId) => {
    return prisma.$transaction(async (tx) => {
        const components = await tx.component.findMany({
            where: {
                projectId: projectId
            },
            select: {
                id: true,
                index: true
            },
            orderBy: [
                {
                    index: 'asc'
                }
            ]
        })

        return Promise.all(components.map((component, index) => {
            return tx.component.update({
                where: {
                    id: component.id
                },
                data: {
                    index: index * MAX_DISTANCE
                },
                select: {
                    id: true,
                    index: true
                }
            })
        }))
    });
}

module.exports = {
    createComponent: async (req, res) => {
        try {
            const {myProjectId} = req.params
            const {type, index, distance, data} = req.body

            let response = {
                indexUpdate: false
            }

            response.component = await prisma.component.create({
                data: {
                    type: type,
                    index: index,
                    data: data,
                    Project: {
                        connect: {
                            id: myProjectId
                        }
                    }
                }
            })

            if (distance < MIN_DISTANCE){
                response.indexes = await updateComponentsIndex(myProjectId)
                response.indexUpdate = true
            }

            console.log("Created component.")

            return res.status(200).json(response)
        } catch (e) {
            console.error(`Error when trying to create component: ${e}`)

            return res.status(500).json({message: "Couldn't create component."})
        }
    },

    updateComponent: async (req, res) => {
        try {
            const {componentId} = req.params
            const {type, data} = req.body

            const component = await prisma.component.update({
                where: {
                    id: componentId
                },
                data: {
                    type: type,
                    data: data
                }
            })

            console.log("Updated component.")

            return res.status(200).json(component)
        } catch (e) {
            console.error(`Error when trying to update component: ${e}`)

            return res.status(500).json({message: "Couldn't update component."})
        }
    },

    deleteComponent: async (req, res) => {
        try {
            const {componentId} = req.params

            await prisma.component.delete({
                where: {
                    id: componentId
                }
            })

            console.log("Deleted component.")

            return res.sendStatus(200)
        } catch (e) {
            console.error(`Error when trying to delete component: ${e}`)

            return res.status(500).json({message: "Couldn't delete component."})
        }
    },

    moveComponent: async (req, res) => {
        try {
            const {componentId, myProjectId} = req.params
            const {newIndex, distance} = req.body

            let response = {
                indexUpdate: false
            }

            response.component = await prisma.component.update({
                where: {
                    id: componentId
                },
                data: {
                    index: newIndex
                }
            })

            if (distance < MIN_DISTANCE){
                response.indexes = await updateComponentsIndex(myProjectId)
                response.indexUpdate = true
            }

            return res.status(200).json(response)

        } catch (e) {
            console.error(`Error when trying to move component: ${e}`)

            return res.status(500).json({message: "Couldn't move component."})
        }
    }
}