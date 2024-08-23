import bcrypt from "bcrypt";
import {User, Role} from "@prisma/client";
import {Request, Response} from "express";
import {prisma} from "./client";
import {generateAccessToken} from "./auth/jwt";
import {NB_SALT_ROUNDS} from "../config";
import {exclude} from "../utils/exclude";

const create = async (req: Request, res: Response) => {
    try {
        const data = req.body

        const usernameRegex = /^\w+$/
        if (!usernameRegex.test(data.username)) {
            throw new Error("Username can only contain digits, uppercase and lowercase letters. No special characters are allowed.")
        }

        const salt = await bcrypt.genSalt(<number>NB_SALT_ROUNDS)
        let hashedPwd = await bcrypt.hash(data.pwd, salt)

        let user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                pwd: hashedPwd,
                firstName: data.firstName,
                lastName: data.lastName,
                role: Role.EDITOR,
                resume: {
                    create: {}
                }
            }
        })

        user = <User>exclude(user, ['pwd'])

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
};

const login = async (req: Request, res: Response) => {
    const data = req.body

    try {
        let user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user || !await bcrypt.compare(data.pwd, user.pwd)) {
            return res.status(401).json({
                message: "Wrong email or password."
            })
        }

        user = <User>exclude(user, ['pwd'])

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

};

const getUser = async (req: Request, res: Response) => {
    const data = req.user

    try {
        return res.status(200).json({
            username: data?.username
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({message: "Internal Server Error"})
    }

};

const deleteUser = async (req: Request, res: Response) => {
    const data = req.body

    try {

        //delete user
        const user = await prisma.user.delete({
            where: {
                id: data.id
            }
        })

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

    //Clearing cookie
    res.clearCookie("jwt_token")
};

export {create, login, getUser, deleteUser}