import {Router} from "express";
import {getPortfolio, getProject, getResume} from "../../service/viewer";


const viewerRouter = Router()

viewerRouter.route("/:username/resume").get(getResume)

viewerRouter.route("/:username/projects").get(getPortfolio)
viewerRouter.route("/:username/projects/:projectId").get(getProject)

export {viewerRouter}