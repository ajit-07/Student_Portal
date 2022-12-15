const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res, next) => {
    try {
        let token = req.headers["authorization"]
        if (!token) return res.status(401).send({ status: false, message: "Token is required" })

        token = token.split(" ")[1]

        jwt.verify(token, "ajit07", (error, decodedToken) => {
            if (error) {
                let message = error.message === "jwt expired" ? "Token expired" : "Token invalid"
                return res.status(401).send({ status: false, message: message })
            }
            //req.headers = decodedToken
            req["adminId"]=decodedToken.adminId
            return next()
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}