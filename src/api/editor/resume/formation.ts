import {Router} from "express";
import {Role} from "@prisma/client";
import {verifyAccessToken} from "../../../service/auth/jwt";
import {
    createFormation, deleteFormation,
    getAllFormations,
    getFormations,
    updateFormation
} from "../../../service/editor/resume/formation";


const formationRouter = Router()

formationRouter.route("/formations")
    .get(verifyAccessToken([Role.EDITOR]), getAllFormations)
    .post(verifyAccessToken([Role.EDITOR]), createFormation)

formationRouter.route("/formations/:formationId")
    .get(verifyAccessToken([Role.EDITOR]), getFormations)
    .put(verifyAccessToken([Role.EDITOR]), updateFormation)
    .delete(verifyAccessToken([Role.EDITOR]), deleteFormation)

export {formationRouter}