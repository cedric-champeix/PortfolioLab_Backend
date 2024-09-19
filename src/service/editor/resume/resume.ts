import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { exclude } from '../../../utils/exclude';
import { prisma } from '../../client';

const getResume = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const userResume = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                resume: {
                    include: {
                        Image: true,
                        User: true,
                    },
                },
            },
        });

        if (!userResume || !userResume.resume) {
            return res.status(200).json({});
        } else {
            userResume.resume.User = <User>(
                exclude(userResume.resume.User, ['pwd', 'id', 'role'])
            );

            console.log(userResume.resume);

            //console.log("Get resume: ", userResume)
            return res.status(200).json(userResume.resume);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't get resume." });
    }
};

const getFullResume = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const userResume = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                firstName: true,
                lastName: true,
                resume: {
                    include: {
                        Image: true,
                        skills: true,
                        experiences: true,
                        formations: true,
                        languages: true,
                        hobbies: true,
                        contacts: true,
                    },
                },
            },
        });

        return res.status(200).json(userResume);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't get resume." });
    }
};

const updateResume = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = req.user;

        const resume = await prisma.resume.update({
            where: {
                userId: user.id,
            },
            data: {
                description: data.description,
                title: data.title,
            },
            include: {
                Image: true,
            },
        });

        console.log('Update resume:', resume);

        return res.status(200).json(resume);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't update resume." });
    }
};

const resetResume = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const deleteResume = prisma.resume.delete({
            where: {
                userId: user.id,
            },
        });

        const createResume = prisma.resume.create({
            data: {
                User: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        await prisma.$transaction([deleteResume, createResume]);

        console.log('Reset of ', req.user.username, "'s resume.");

        return res
            .status(200)
            .json({ message: 'The resume was successfully reset.' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't reset resume." });
    }
};

const connectImage = async (req: Request, res: Response) => {
    try {
        const { imageId } = req.params;

        console.log(imageId);

        await prisma.resume.update({
            where: {
                userId: req.user.id,
            },
            data: {
                Image: {
                    connect: { id: imageId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't connect image." });
    }
};

const disconnectImage = async (req: Request, res: Response) => {
    try {
        await prisma.resume.update({
            where: {
                userId: req.user.id,
            },
            data: {
                Image: {
                    disconnect: true,
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't disconnect image." });
    }
};

const connectSkill = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const skillId = req.params.skillId;

        await prisma.resume.update({
            where: {
                userId: user.id,
            },
            data: {
                skills: {
                    connect: { id: skillId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't connect skill." });
    }
};

const disconnectSkill = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const skillId = req.params.skillId;

        await prisma.resume.update({
            where: {
                userId: user.id,
            },
            data: {
                skills: {
                    disconnect: { id: skillId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't disconnect skill." });
    }
};

const connectSocial = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;

        await prisma.resume.update({
            where: {
                userId: user.id,
            },
            data: {
                contacts: {
                    connect: { id: contactId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't connect contact." });
    }
};

const disconnectSocial = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;

        await prisma.resume.update({
            where: {
                userId: user.id,
            },
            data: {
                contacts: {
                    disconnect: { id: contactId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't disconnect contact." });
    }
};

const publish = async (req: Request, res: Response) => {
    try {
        const id = req.user.id;
        //The goal is to retrieve the resume data and duplicate it into "resume.publishedData"
        //So we fetch the data, delete the attributes we do not want and feed the data into the published data

        const resume = await prisma.resume.findUnique({
            where: {
                userId: id,
            },
            include: {
                skills: true,
                experiences: true,
                formations: true,
                hobbies: true,
                languages: true,
                contacts: true,
                Image: true,
            },
        });

        if (!resume) {
            return res.status(500).json({ message: 'No resume to publish.' });
        } else {
            // We delete the unnecessary attributes
            const publishedData = exclude(resume, [
                'publishedData',
                'published',
                'userId',
                'id',
            ]);

            //Updating the resume
            await prisma.resume.update({
                where: {
                    userId: id,
                },
                data: {
                    published: true,
                    publishedData: publishedData,
                },
            });

            return res.sendStatus(200);
        }
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't publish the resume." });
    }
};

const unpublish = async (req: Request, res: Response) => {
    try {
        const id = req.user.id;
        //To unpublish, we delete the published data simply.
        await prisma.resume.update({
            where: {
                userId: id,
            },
            data: {
                published: false,
                publishedData: {},
            },
        });
        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't unpublish the resume." });
    }
};

export {
    connectImage,
    connectSkill,
    connectSocial,
    disconnectImage,
    disconnectSkill,
    disconnectSocial,
    getFullResume,
    getResume,
    publish,
    resetResume,
    unpublish,
    updateResume,
};
