const prisma = require("../client")

module.exports = {

    getAllContacts: async (req, res) => {
        try {
            const user = req.user

            const contacts = await prisma.contact.findMany({
                where: {
                    userId: user.id
                }
            })

            return res.status(200).json(contacts)
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get contacts."})
        }
    },

    getContact: async (req, res) => {
        try {
            const contactId = req.params.contactId

            const contact = await prisma.contact.findUnique({
                where: {
                    id: contactId
                }
            })

            return res.status(200).json(contact)

        }catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't get contact."})
        }
    },

    createContact: async (req, res) => {
        try {
            const data = req.body

            if (!("resumeId" in data)){
                data.Resume = {};
            }else {
                data.Resume = {connect: {id: data.resumeId}};
            }

            const contact = await prisma.contact.create({
                data: {
                    title: data.title,
                    text: data.text,
                    Resume: data.Resume,
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }
            })

            return res.status(200).json(contact)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create contact."})
        }
    },

    updateContact: async (req, res) => {
        try {
            const data = req.body
            const contactId = req.params.contactId

            let valuesToModify = {}
            const acceptable_keys = ["title", "text"]

            for (const key of acceptable_keys) {
                if (key in data)
                    valuesToModify[key] = data[key]
            }

            const contact = await prisma.contact.update({
                where: {
                    id: contactId
                },
                data: valuesToModify
            })

            return res.status(200).json(contact)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't update contact."})
        }
    },

    deleteContact: async (req, res) => {
        try {
            const contactId = req.params.contactId

            await prisma.contact.delete({
                where: {
                    id: contactId,
                    userId: req.user.id
                }
            })

            return res.sendStatus(200)

        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't delete contact."})
        }
    },
}