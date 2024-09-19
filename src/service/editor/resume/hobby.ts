import { Request, Response } from 'express';
import { prisma } from '../../client';

const getAllHobbies = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const hobbies = await prisma.hobby.findMany({
            where: {
                userId: user.id,
            },
        });

        return res.status(200).json(hobbies);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't get hobbies." });
    }
};

const getHobby = async (req: Request, res: Response) => {
    try {
        const hobbyId = req.params.hobbyId;

        const hobby = await prisma.hobby.findUnique({
            where: {
                id: hobbyId,
            },
        });

        return res.status(200).json(hobby);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't get hobby." });
    }
};

const createHobby = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const hobby = await prisma.hobby.create({
            data: {
                name: data.name,
                description: data.description,
                Resume: {
                    connect: {
                        id: data.resumeId,
                    },
                },
                user: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });

        console.log('Created hobby: ', hobby);
        return res.status(200).json(hobby);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't create hobby." });
    }
};

const updateHobby = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = req.user;
        const hobbyId = req.params.hobbyId;

        const hobby = await prisma.hobby.update({
            where: {
                id: hobbyId,
                userId: user.id,
            },
            data: {
                name: data.name,
                description: data.description,
            },
        });

        console.log('Updated hobby:', hobby);
        return res.status(200).json(hobby);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't update hobby." });
    }
};

const deleteHobby = async (req: Request, res: Response) => {
    try {
        const hobbyId = req.params.hobbyId;

        await prisma.hobby.delete({
            where: {
                id: hobbyId,
                userId: req.user.id,
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't delete hobby." });
    }
};

export { createHobby, deleteHobby, getAllHobbies, getHobby, updateHobby };
