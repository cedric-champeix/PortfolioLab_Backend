import {Router} from "express";
import {Role} from "@prisma/client";
import {verifyAccessToken} from "../../../service/auth/jwt";
import {createHobby, deleteHobby, getAllHobbies, getHobby, updateHobby} from "../../../service/editor/resume/hobby";


const hobbyRouter = Router()

hobbyRouter.route("/hobbies")
    .get(verifyAccessToken([Role.EDITOR]), getAllHobbies)
    .post(verifyAccessToken([Role.EDITOR]), createHobby)

hobbyRouter.route("/hobbies/:hobbyId")
    .get(verifyAccessToken([Role.EDITOR]), getHobby)
    .put(verifyAccessToken([Role.EDITOR]), updateHobby)
    .delete(verifyAccessToken([Role.EDITOR]), deleteHobby)

export {hobbyRouter}