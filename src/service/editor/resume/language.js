const prisma = require("../../client")

module.exports = {

    getAllLanguages: async (req, res) => {
        try {
            const user = req.user

            const languages = await prisma.language.findMany({
                where: {
                    userId: user.id
                }
            })

            return res.status(200).json(languages)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get languages."})
        }
    },

    getLanguage: async (req, res) => {
        try {
            const languageId = req.params.languageId

            const language = await prisma.language.findUnique({
                where: {
                    id: languageId
                }
            })

            return res.status(200).json(language)

        }catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get language."})
        }
    },

    createLanguage: async (req, res) => {
        try {
            const data = req.body

            const language = await prisma.language.create({
                data: {
                    name: data.name,
                    level: data.level,
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

            console.log("Created language: ", language)
            return res.status(200).json(language)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create language."})
        }
    },

    updateLanguage: async (req, res) => {
        try {
            const data = req.body
            const user = req.user
            const languageId = req.params.languageId

            const language = await prisma.language.update({
                where: {
                    id: languageId,
                    userId: user.id
                },
                data: {
                    name: data.name,
                    level: data.level
                }
            })

            console.log("Updated language:", language)
            return res.status(200).json(language)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update language."})
        }
    },

    deleteLanguage: async (req, res) => {
        try {
            const languageId = req.params.languageId

            await prisma.language.delete({
                where: {
                    id: languageId,
                    userId: req.user.id
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete language."})
        }
    },
}