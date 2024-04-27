const prisma = require('./client')
const exclude = require("./../utils/exclude")
const {del} = require("express/lib/application");
/**
 * The goal of this request is to provide the information of a user in readonly, if and only if the user authorized and published its resume
 *
 */

module.exports = {
    getResume: async (req, res) => {
        try {
            const {username} = req.params

            /*
             * STEP 1 : we need to check whether the resume is public or private
             * We fetch the published attribute of the resume first
             */
            const published = await prisma.user.findUnique({
                where: {
                    username: username
                },
                select: {
                    resume: {
                        select: {
                            published: true
                        }
                    }
                }
            })
            /*
             * If the resume is private, we notify the client that the resume is unpublished
             */
            if(!published.resume.published){
                return res.status(200).json({message: "The user's resume is not available publicly"})
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
            if(userResume === null) {
                return res.status(404).json({message: "No resume found."})
            }
            /*
             * STEP 3 : treat the data
             * Wire the published data into the resume
             */
            userResume.resume.skills = userResume.resume.publishedData.skills
            userResume.resume.experiences= userResume.resume.publishedData.experiences
            userResume.resume.contacts= userResume.resume.publishedData.contacts
            userResume.resume.formations= userResume.resume.publishedData.formations
            userResume.resume.languages= userResume.resume.publishedData.languages
            userResume.resume.hobbies= {...userResume.resume.publishedData.hobbies, "test": true}
            userResume.resume.Image= userResume.resume.publishedData.Image

            //Now the published data is wired into the resume, so we do not need it
            delete(userResume.resume.publishedData)
            console.log("UserResume : ", userResume)

            return res.status(200).json(userResume)

        } catch (e) {
            console.error(e)
            console.log("Error : resume can not be fetched")
            return res.status(500).json({message: "Error : resume can not be fetched"})
        }
    },

    getProjects: async (req, res) => {
        try {
            const id = req.userId

            const projects = await prisma.project.findMany({
                where: {
                    userId: id,
                    published: true
                }
            })

            console.log("Projects fetched")
            console.log(projects)
            return res.status(200).json(projects)
        } catch (e) {
            console.error(e)
            console.log("Error : projects can not be fetched")
            return res.status(500).json({message: "Error : projects can not be fetched"})
        }
    }
}