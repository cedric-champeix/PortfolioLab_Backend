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
const resumeRoutes = require("./api/editor/resume")
const skillRoutes = require("./api/editor/skill")
const socialRoutes = require("./api/editor/social")
const experienceRoutes = require("./api/editor/experience")
const formationRoutes = require("./api/editor/formation")
const projectRoutes = require("./api/editor/project")

app.use("/", authRoutes)
app.use("/editor", resumeRoutes)
app.use("/editor", skillRoutes)
app.use("/editor", socialRoutes)
app.use("/editor", experienceRoutes)
app.use("/editor", formationRoutes)
app.use("/editor", projectRoutes)

app.use("/public", express.static(path.join(__dirname, '../../public')))

app.listen(config.PORT)
