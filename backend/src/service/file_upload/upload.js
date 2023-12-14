const multer = require("multer")
const {join} = require("path");
const fs = require("node:fs");

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false)
    }
}

const projectFile = "project.md"
const projectMainImage = "mainImage"
const fileSize1Mo = 1000000


module.exports = {

    uploadResumeImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const resumeFolder = join(__dirname, "../../../public/editors", req.user.username, "resume")

                if (!fs.existsSync(resumeFolder)) {
                    await fs.promises.mkdir(resumeFolder, {recursive: true})
                }

                cb(null, resumeFolder)
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: 5*fileSize1Mo}
    }),

    uploadProjectFile: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const projectFolder = join(__dirname, "../../../public/editors", req.user.username, "projects", req.body.projectName)

                if (!fs.existsSync(projectFolder)) {
                    await fs.promises.mkdir(projectFolder, {recursive: true})
                }

                cb(null, projectFolder)
            },
            filename: (req, file, cb) => {
                cb(null, projectFile)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(md)$/)) {
                cb(null, false)
            }
            cb(null, true)
        },
        limits: {fileSize: fileSize1Mo * 10}
    }),

    uploadProjectMainImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const projectFolder = join(__dirname, "../../../public/editors", req.user.username, "projects", req.body.projectName)

                if (!fs.existsSync(projectFolder)) {
                    await fs.promises.mkdir(projectFolder, {recursive: true})
                }

                cb(null, projectFolder)
            },
            filename: (req, file, cb) => {
                cb(null, projectMainImage)
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: fileSize1Mo},
    }),

    uploadProjectImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const projectFolder = join(__dirname, "../../../public/editors", req.user.username, "projects", req.body.projectName, "images")

                if (!fs.existsSync(projectFolder)) {
                    await fs.promises.mkdir(projectFolder, {recursive: true})
                }

                cb(null, projectFolder)
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: fileSize1Mo * 10},
    })
}