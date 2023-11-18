const express = require("express")
const config = require("./config")
const bodyParser = require("body-parser")

const app = express ()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

const authRoutes = require("./api/auth")
app.use("/", authRoutes)


app.listen(config.PORT)
