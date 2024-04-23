const prisma = require('./client')
const exclude = require("./../utils/exclude")
/**
 * The goal of this request is to provide the information of a user in readonly, if and only if the user authorized and published its resume
 *
 */

module.exports = {
    getResume: async (req, res) => {
        try {
            const {username} = req.params

            //We had a concern on whether we should use the username or the id to retrieve the data.
            //However, the id is already a field of the resume, so using the username would be suboptimal
            const resume = await prisma.user.findUnique({
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
                            Image: true
                        }
                    }
                }

            })
            //In this part we do not want certain fields like the id and the visibility
            //const filteredResume = exclude.exclude(resume, ["published"])['0']


            console.log("Resume fetched")
            if(resume === null) {
                return res.status(404).json({message: "No resume found."})
            }
            return res.status(200).json(resume)

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