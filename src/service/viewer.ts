import {Request, Response} from "express";
import {prisma} from "./client";

/**
 * The goal of this request is to provide the information of a user in readonly, if and only if the user authorized and published its resume
 *
 */

const getResume = async (req: Request, res: Response) => {
    try {
        const {username} = req.params

        /*
         * STEP 1 : we need to check whether the resume is public or private
         * We fetch the published attribute of the resume first
         */
        const published = await prisma.user.findUnique({
            where: {
                username: username,
                resume: {
                    published: true
                }
            },
        })
        /*
         * If the resume is private, we notify the client that the resume is unpublished
         */
        if (!published) {
            return res.status(200).json({published: false})
        }

        /*
         * STEP 2 : if the resume is public, we need to get the data and transform it to have the published data instead of the data itself
         * We first get the data
         */
        const userResume = await prisma.user.findUnique({
            where: {
                username: username
            },
            //Include all the fields
            select: {
                firstName: true,
                lastName: true,
                resume: {
                    include: {
                        skills: true,
                        experiences: true,
                        formations: true,
                        languages: true,
                        hobbies: true,
                        contacts: true,
                        Image: true,
                    }
                }
            }

        })

        console.log("Resume fetched")
        //We also check that we have a result
        if (!userResume?.resume) {
            return res.status(404).json({message: "No resume found."})
        }
        /*
         * STEP 3 : treat the data
         * Wire the published data into the resume
         */

        console.log("UserResume : ", userResume.resume.publishedData)

        // @ts-ignore
        userResume.resume = {...userResume.resume.publishedData}

        // @ts-ignore
        userResume.resume.published = true

        //Now the published data is wired into the resume, so we do not need it
        // @ts-ignore
        delete userResume.resume.publishedData

        return res.status(200).json(userResume)

    } catch (e) {
        console.error(e)
        console.log("Error : resume can not be fetched")
        return res.status(500).json({message: "Error : resume can not be fetched"})
    }
};

const getPortfolio = async (req: Request, res: Response) => {
    try {
        const {username} = req.params

        const userProjects = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                projects: {
                    where: {
                        visible: true
                    },
                    include: {
                        MainImage: true,
                        skills: true
                    }
                }
            }
        })

        console.log("Projects fetched: ", userProjects)
        return res.status(200).json((userProjects ? userProjects.projects : []))
    } catch (e) {
        console.error("Could not fetch projects: ", e)
        return res.status(500).json({message: "Error : projects can not be fetched"})
    }
};

const getProject = async (req: Request, res: Response) => {
    try {
        const {username, projectId} = req.params

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                visible: true,
                User: {
                    username: username
                }
            },
            include: {
                components: {
                    orderBy: {
                        index: "asc"
                    }
                },
                skills: true,
                MainImage: true,
                ProjectImages: true
            }
        })

        if (!project)
            return res.status(404).json({message: "No project found."})

        return res.status(200).json(project)

    } catch (e) {
        console.error("Could not fetch project: ", e)
        return res.status(500).json({message: "Error: could not fetch project"})
    }
};

export {getResume, getPortfolio, getProject}