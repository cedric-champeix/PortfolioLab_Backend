const jwt = require("jsonwebtoken")
const prisma = require("../client")

module.exports = {
    verifyAccessToken: (requiredRole) => async (req, res, next) => {
        try {
            const jwt_token = req.cookies.jwt_token

            if (!jwt_token)
                return res.status(401).json({message: 'No token provided.'})

            const decoded = await jwt.verify(jwt_token, process.env.JWT_SECRET_KEY)

            const {id} = decoded
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })

            if (!user)
                return res.status(500).json({message: "Couldn't find user."})

            if (!requiredRole.includes(user.role))
                return res.sendStatus(403).json({message: 'You do not have the authorization and permissions to access this resource.'})

            delete user.pwd
            req.user = user
            next()

        } catch (e) {
            return res
                .status(401)
                .json({message: "This session has expired. Please login."})
        }
    },

    generateAccessToken: (user) => {
        const payload = {
            id: user.id,
            role: user.role
        }

        const secret = process.env.JWT_SECRET_KEY
        const options = {expiresIn: '24h'}

        return jwt.sign(payload, secret, options)
    },

    Roles: Object.freeze({
        ADMIN: 'admin',
        Editor: 'editor'
    })
}




