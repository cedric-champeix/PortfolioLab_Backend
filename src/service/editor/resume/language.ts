import {Request, Response} from "express";
import {prisma} from "../../client";

const getAllLanguages = async (req: Request, res: Response) => {
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
};

const getLanguage = async (req: Request, res: Response) => {
    try {
        const languageId = req.params.languageId

        const language = await prisma.language.findUnique({
            where: {
                id: languageId
            }
        })

        return res.status(200).json(language)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't get language."})
    }
};

const createLanguage = async (req: Request, res: Response) => {
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
};

const updateLanguage = async (req: Request, res: Response) => {
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
};

const deleteLanguage = async (req: Request, res: Response) => {
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
}

export {getAllLanguages, getLanguage, createLanguage, updateLanguage, deleteLanguage}