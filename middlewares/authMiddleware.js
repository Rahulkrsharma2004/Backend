const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const { BlacklistToken } = require("../models/blacklistModel")

const access_secretKey = process.env.ACCESS_SECRET_KEY
const refresh_secretKey = process.env.REFRESH_SECRET_KEY

const auth = async (req, res, next) => {
    const token = req.cookies.ACCESS_TOKEN
    const refresh_token = req.cookies.REFRESH_TOKEN

    try {
        if (await BlacklistToken.findOne({ token })) {
        throw new Error( "Please login again" )
        } 
        jwt.verify(token, access_secretKey, (err, decode) => {
            if (decode) {
                req.body.userID = decode.userID
                req.body.user = decode.user
                next()
    
            } else {
                jwt.verify(refresh_token, refresh_secretKey, (err, decode) => {
                    if (decode) {
                        const token = jwt.sign({userID:decode._id,user:decode.username}, access_secretKey, { expiresIn: "1h" })
                        res.cookie("ACCESS_TOKEN", token)
                        next()
                    } else {
                        res.status(400).send({ "msg": "Now you need to login again" })
                    }
                })
                res.status(400).send({ "error": err })
            }
        });
    }
     catch (error) {
      res.status(400).send({"error":error.message})  
    }
    

    
}

module.exports = {
    auth
}