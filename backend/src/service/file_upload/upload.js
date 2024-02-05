const multer = require("multer")
const {join, extname} = require("path")
const fs = require("node:fs")
const uuid = require("uuid")

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false)
    }
}

const editorDestination = async (username) => {
    const projectFolder = join(process.cwd(), "/public/editors", username)

    if (!fs.existsSync(projectFolder)) {
        await fs.promises.mkdir(projectFolder, {recursive: true})
    }

    return projectFolder
}

const fileSize1Mo = 1048576


module.exports = {

    uploadResumeImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const dest = await editorDestination(req.user.username)
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                cb(null, uuid.v4() + extname(file.originalname))
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: 5*fileSize1Mo}
    }),

    uploadProjectMainImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const dest = await editorDestination(req.user.username)
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                cb(null, uuid.v4() + extname(file.originalname))
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: fileSize1Mo * 2},
    }),

    uploadProjectImage: multer({
        storage: multer.diskStorage({
            destination: async (req, file, cb) => {
                const dest = await editorDestination(req.user.username)
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                cb(null, uuid.v4() + extname(file.originalname))
            }
        }),
        fileFilter: imageFilter,
        limits: {fileSize: fileSize1Mo * 10},
    })
}