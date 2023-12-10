const prisma = require("./client")
const bcrypt = require("bcrypt")
const {generateAccessToken, Roles} = require("./auth/jwt")
const {NB_SALT_ROUNDS} = require("../config")

module.exports = {
    create: async (req, res) => {
        try {
            const data = req.body
            const salt = await bcrypt.genSalt(NB_SALT_ROUNDS)
            let hashedPwd = await bcrypt.hash(data.pwd, salt)

            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    pwd: hashedPwd,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: Roles.Editor,
                    resume: {
                        create: {}
                    }
                },
            })

            delete user.pwd

            const options = {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
                withCredentials: true
            }
            const accessToken = generateAccessToken(user)

            res.cookie("jwt_token", accessToken, options)

            console.log("Connection: ", user)
            return res.status(200).json({
                status: true,
                result: {
                    user: user
                },
            })
        } catch (e) {
            console.error(e)
            return res.status(500).json({message: "Couldn't create account."})
        }
    },

    login: async (req, res) => {
        const data = req.body

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: data.email
                }
            })

            if (!user || !await bcrypt.compare(data.pwd, user.pwd)) {
                return res.status(401).json({
                    message: "Wrong email or password."
                })
            }

            delete user.pwd

            const options = {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
                withCredentials: true
            }
            const accessToken = generateAccessToken(user)

            res.cookie("jwt_token", accessToken, options)

            console.log("Connection: ", user)
            return res.status(200).json({
                status: true,
                result: {
                    user: user
                },
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Internal Server Error"})
        }


    }
}

