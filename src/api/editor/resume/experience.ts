import {Router} from "express";
import {Role} from "@prisma/client";
import {verifyAccessToken} from "../../../service/auth/jwt";
import {
    createExperience, deleteExperience,
    getAllExperience,
    getExperience,
    updateExperience
} from "../../../service/editor/resume/experience";


const experienceRouter = Router()

experienceRouter.route("/experiences")
    .get(verifyAccessToken([Role.EDITOR]), getAllExperience)
    .post(verifyAccessToken([Role.EDITOR]), createExperience)

experienceRouter.route("/experiences/:experienceId")
    .get(verifyAccessToken([Role.EDITOR]), getExperience)
    .put(verifyAccessToken([Role.EDITOR]), updateExperience)
    .delete(verifyAccessToken([Role.EDITOR]), deleteExperience)


export {experienceRouter}