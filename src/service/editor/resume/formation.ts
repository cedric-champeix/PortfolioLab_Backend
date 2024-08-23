import {Request, Response} from "express";
import {prisma} from "../../client";

const getAllFormations = async (req: Request, res: Response) => {
    try {
        const user = req.user

        const formations = await prisma.formations.findMany({
            where: {
                userId: user.id
            }
        })
        console.log(formations)
        return res.status(200).json(formations)
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't get formations."})
    }
};

const getFormations = async (req: Request, res: Response) => {
    try {
        const formationId = req.params.formationId

        const formation = await prisma.formations.findUnique({
            where: {
                id: formationId
            }
        })

        return res.status(200).json(formation)

    } catch (e) {
        return res.status(500).json({message: "Couldn't get formation."})
    }
};

const createFormation = async (req: Request, res: Response) => {
    try {
        const data = req.body

        const formation = await prisma.formations.create({
            data: {
                formationName: data.formationName,
                universityName: data.universityName,
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

        console.log("Created formation: ", formation)
        return res.status(200).json(formation)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't create formation."})
    }
};

const updateFormation = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const user = req.user
        const formationId = req.params.formationId

        let valuesToModify: Record<string, any> = {}
        const acceptable_keys = ["formationName", "universityName", "description", "startDate", "endDate"]

        for (const key of acceptable_keys) {
            if (key in data)
                valuesToModify[key] = data[key]
        }

        const formation = await prisma.formations.update({
            where: {
                id: formationId,
                userId: user.id
            },
            data: valuesToModify
        })

        console.log("Updated formation:", formation)
        return res.status(200).json(formation)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't update formation."})
    }
};

const deleteFormation = async (req: Request, res: Response) => {
    try {
        const formationId = req.params.formationId

        await prisma.formations.delete({
            where: {
                id: formationId,
                userId: req.user.id
            }
        })

        console.log(`Formation deleted: ${formationId}`)
        return res.sendStatus(200)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't delete formation."})
    }
};

export {getAllFormations, getFormations, createFormation, updateFormation, deleteFormation}