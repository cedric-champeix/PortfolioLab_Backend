import { Request, Response } from 'express';
import { prisma } from '../../client';

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const userProjects = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                projects: {
                    include: {
                        MainImage: true,
                        skills: true,
                    },
                },
            },
        });

        if (!userProjects?.projects) {
            return res.status(200).json([]);
        }

        return res.status(200).json(userProjects.projects);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't get projects." });
    }
};

const getProject = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { myProjectId } = req.params;

        const project = await prisma.project.findUnique({
            where: {
                id: myProjectId,
                userId: user.id,
            },
            include: {
                components: {
                    orderBy: {
                        index: 'asc',
                    },
                },
                skills: true,
                MainImage: true,
                ProjectImages: true,
            },
        });

        return res.status(200).json(project);
    } catch (e) {
        console.error('Error when accessing project: ', e);
        return res.status(500).json({ message: "Couldn't get project." });
    }
};

const createProject = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        const body = req.body;

        const project = await prisma.project.create({
            data: {
                name: body.name,
                User: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        return res.status(200).json(project);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't create project." });
    }
};

const updateProject = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        const { myProjectId } = req.params;
        const body = req.body;

        const valuesToModify: Record<string, any> = {};

        const acceptable_keys = ['name', 'description', 'contributors'];
        for (const key of acceptable_keys) {
            if (key in body) {
                valuesToModify[key] = body[key];
            }
        }

        const project = await prisma.project.update({
            where: {
                id: myProjectId,
                userId: user.id,
            },
            data: valuesToModify,
            include: {
                skills: true,
                MainImage: true,
                ProjectImages: true,
                components: {
                    orderBy: {
                        index: 'asc',
                    },
                },
            },
        });

        return res.status(200).json(project);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't update project." });
    }
};

const deleteProject = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { myProjectId } = req.params;

        await prisma.project.delete({
            where: {
                id: myProjectId,
                userId: user.id,
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't delete project." });
    }
};

const updateProjectVisibility = async (req: Request, res: Response) => {
    try {
        const { user, body } = req;
        const { myProjectId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: user.id,
            },
            data: {
                visible: body.visible,
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't update project visibility." });
    }
};

const connectSkill = async (req: Request, res: Response) => {
    try {
        const { myProjectId, skillId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
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
        const { myProjectId, skillId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
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

const connectMainImage = async (req: Request, res: Response) => {
    try {
        const { myProjectId, imageId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
            },
            data: {
                MainImage: {
                    connect: { id: imageId },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't connect main image." });
    }
};

const disconnectMainImage = async (req: Request, res: Response) => {
    try {
        const { myProjectId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
            },
            data: {
                MainImage: {
                    disconnect: true,
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: "Couldn't disconnect main image." });
    }
};

const connectProjectImage = async (req: Request, res: Response) => {
    try {
        const { myProjectId, imageId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
            },
            data: {
                ProjectImages: {
                    connect: [{ id: imageId }],
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't connect image." });
    }
};

const disconnectProjectImage = async (req: Request, res: Response) => {
    try {
        const { myProjectId, imageId } = req.params;

        await prisma.project.update({
            where: {
                id: myProjectId,
                userId: req.user.id,
            },
            data: {
                ProjectImages: {
                    disconnect: {
                        id: imageId,
                    },
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't disconnect image." });
    }
};

const publish = async (req: Request, res: Response) => {
    try {
        const { myProjectId } = req.params;
        const { user } = req;

        const publish = await prisma.project.update({
            where: {
                userId: user.id,
                id: myProjectId,
            },
            data: {
                published: true,
            },
        });
        return res.status(200).json(publish);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't update project." });
    }
};

const unpublish = async (req: Request, res: Response) => {
    try {
        const { myProjectId } = req.params;
        const { user } = req;

        const publish = await prisma.project.update({
            where: {
                userId: user.id,
                id: myProjectId,
            },
            data: {
                published: false,
            },
        });
        return res.status(200).json(publish);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Couldn't update project." });
    }
};

export {
    connectMainImage,
    connectProjectImage,
    connectSkill,
    createProject,
    deleteProject,
    disconnectMainImage,
    disconnectProjectImage,
    disconnectSkill,
    getAllProjects,
    getProject,
    publish,
    unpublish,
    updateProject,
    updateProjectVisibility,
};
