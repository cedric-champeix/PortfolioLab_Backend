import {Router} from "express";
import {Role} from "@prisma/client";
import {create, login, getUser, deleteUser} from "../service/user";
import {verifyAccessToken} from "../service/auth/jwt";


const authRouter = Router()

authRouter.post("/signup", create)

authRouter.post("/login", login)

// TODO: Change routes to /user
authRouter.get("/getUser", verifyAccessToken([Role.EDITOR]), getUser)
authRouter.delete('/deleteUser', verifyAccessToken([Role.EDITOR]), deleteUser)

export {authRouter}