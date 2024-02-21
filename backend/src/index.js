const express = require("express")
const config = require("./config")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const path = require("path");

const app = express()
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.use(cors({
    origin: config.REACT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

const authRoutes = require("./api/auth")
const imageRoutes = require("./api/editor/image")
const projectRoutes = require("./api/editor/project/project")
const componentRoutes = require("./api/editor/project/component")
const resumeRoutes = require("./api/editor/resume/resume")
const skillRoutes = require("./api/editor/resume/skill")
const contactRoutes = require("./api/editor/resume/contact")
const experienceRoutes = require("./api/editor/resume/experience")
const formationRoutes = require("./api/editor/resume/formation")
const languageRoutes = require("./api/editor/resume/language")
const hobbyRoutes = require("./api/editor/resume/hobby")
const viewerRoutes = require("./api/viewer/viewer")

app.use("/", authRoutes)
app.use("/editor", imageRoutes)
app.use("/editor", projectRoutes)
app.use("/editor", componentRoutes)
app.use("/editor", resumeRoutes)
app.use("/editor", skillRoutes)
app.use("/editor", contactRoutes)
app.use("/editor", experienceRoutes)
app.use("/editor", formationRoutes)
app.use("/editor", languageRoutes)
app.use("/editor", hobbyRoutes)
app.use("/viewer", viewerRoutes)

app.use("/public", express.static(path.join(__dirname, '../public')))

app.listen(config.PORT)
