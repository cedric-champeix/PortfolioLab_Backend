const app = require("express")
const user = require("../service/user")

let router = new app.Router()

router.post("/signup", user.create)

router.post("/login", user.login)

router.post("/logout", user.logout)

module.exports = router