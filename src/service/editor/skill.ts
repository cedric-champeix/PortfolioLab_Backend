import {Request, Response} from "express";
import {prisma} from "../client";


const getAllSkills = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const data = req.query

        const filter: Record<string, any> = {
            userId: user.id
        }

        if (data.resumeId) {
            filter.resumeId = data.resumeId
        } else if (data.projectId) {
            filter.projectsIds = {
                has: data.projectId,
            }
        }

        const skills = await prisma.skill.findMany({
            where: filter
        })

        return res.status(200).json(skills)
    } catch (e) {
        return res.status(500).json({message: "Couldn't get skills."})
    }
};

const getSkill = async (req: Request, res: Response) => {
    try {
        const skillId = req.params.skillId

        const skill = await prisma.skill.findUnique({
            where: {
                id: skillId
            }
        })

        return res.status(200).json(skill)

    } catch (e) {
        return res.status(500).json({message: "Couldn't get skill."})
    }
};

const createSkill = async (req: Request, res: Response) => {
    try {
        const data = req.body

        if (!("resumeId" in data)) {
            data.Resume = {};
        } else {
            data.Resume = {connect: {id: data.resumeId}};
        }

        if (!("Projects" in data)) {
            data.Projects = [];
        }

        const skill = await prisma.skill.create({
            data: {
                name: data.name,
                description: data.description,
                isSoft: data.isSoft,
                Resume: data.Resume,
                Projects: {
                    connect: data.Projects
                },
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        })

        console.log("Created skill: ", skill)
        return res.status(200).json(skill)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't create skill."})
    }
};

const updateSkill = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const skillId = req.params.skillId

        let valuesToModify: Record<string, any> = {}
        const acceptable_keys = ["name", "description", "isSoft"]

        for (const key of acceptable_keys) {
            if (key in data)
                valuesToModify[key] = data[key]
        }

        const skill = await prisma.skill.update({
            where: {
                id: skillId,
                userId: req.user.id
            },
            data: valuesToModify
        })

        console.log("Updated skill:", skill)
        return res.status(200).json(skill)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't update skill."})
    }
};

const deleteSkill = async (req: Request, res: Response) => {
    try {
        const skillId = req.params.skillId

        await prisma.skill.delete({
            where: {
                id: skillId,
                userId: req.user.id
            }
        })

        console.log(`Skill deleted: ${skillId}`)
        return res.sendStatus(200)

    } catch (e) {
        console.error(e)
        return res.status(500).json({message: "Couldn't delete skill."})
    }
};

export {getAllSkills, getSkill, createSkill, updateSkill, deleteSkill}