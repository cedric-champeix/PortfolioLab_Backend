import {Router} from "express";
import {Role} from "@prisma/client";
import {verifyAccessToken} from "../../../service/auth/jwt";
import {
    createComponent,
    deleteComponent,
    moveComponent,
    updateComponent
} from "../../../service/editor/project/component";


const componentRouter = Router()

componentRouter.route("/projects/:myProjectId/components")
    .post(verifyAccessToken([Role.EDITOR]), createComponent)

componentRouter.route("/projects/:myProjectId/components/:componentId")
    .put(verifyAccessToken([Role.EDITOR]), updateComponent)
    .delete(verifyAccessToken([Role.EDITOR]), deleteComponent)

componentRouter.route("/projects/:myProjectId/components/:componentId/move")
    .put(verifyAccessToken([Role.EDITOR]), moveComponent)

export {componentRouter}