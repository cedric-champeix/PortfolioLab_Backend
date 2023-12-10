const prisma = require("../client")

module.exports = {

    getAllSocials: async (req, res) => {
        try {
            const user = req.user

            const socials = await prisma.social.findMany({
                where: {
                    userId: user.id
                }
            })

            return res.status(200).json(socials)
        } catch (e) {
            return res.status(500).json({message: "Couldn't get social medias."})
        }
    },

    getSocial: async (req, res) => {
        try {
            const socialId = req.params.socialId

            const social = await prisma.social.findUnique({
                where: {
                    id: socialId
                }
            })

            return res.status(200).json(social)

        }catch (e) {
            return res.status(500).json({message: "Couldn't get social media."})
        }
    },

    createSocial: async (req, res) => {
        try {
            const data = req.body

            if (!("resumeId" in data)){
                data.Resume = {};
            }else {
                data.Resume = {connect: {id: data.resumeId}};
            }

            const social = await prisma.social.create({
                data: {
                    name: data.name,
                    link: data.link,
                    Resume: data.Resume,
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }
            })

            return res.status(200).json(social)

        } catch (e) {
            return res.status(500).json({message: "Couldn't create social media."})
        }
    },

    updateSocial: async (req, res) => {
        try {
            const data = req.body
            const skillId = req.params.socialId

            let valuesToModify = {}
            const acceptable_keys = ["name", "link"]

            for (const key of acceptable_keys) {
                if (key in data)
                    valuesToModify[key] = data[key]
            }

            const social = await prisma.social.update({
                where: {
                    id: skillId
                },
                data: valuesToModify
            })

            return res.status(200).json(social)

        } catch (e) {
            return res.status(500).json({message: "Couldn't update social."})
        }
    },

    deleteSocial: async (req, res) => {
        try {
            const socialId = req.params.socialId

            await prisma.social.delete({
                where: {
                    id: socialId,
                    userId: req.user.id
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            return res.status(500).json({message: "Couldn't delete social."})
        }
    },
}