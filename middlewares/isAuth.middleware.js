const jwt = require('jsonwebtoken');

const ErrorHandler = require('../others/ErrorHandler');
const user = require("../models/User.model")

require("dotenv").config()


const isAuthenticated = async (req, res, next) => {
    const token = req?.cookies?.auth || req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
        return next(new ErrorHandler(401, "Unauthorised Request: No token provided"))
    }
    try {
        // console.log(process.env.jwt_secret);
        const decoded = jwt.verify(token, process.env.jwt_secret);

        if (!decoded || !decoded._id) {
            return next(new ErrorHandler(401, "Invalid token"));
        }
        const findUser = await user.findOne({ _id: decoded._id })
        if (!findUser) return next(new ErrorHandler(401, "Token expired or Wrong token"))

        // if (findUser.isBlocked) return next(new ErrorHandler(401, "You are blocked You can't Perform Actions"))

        req.user = findUser
        return next()

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
            return next(new ErrorHandler(401, "Unauthorized: Token expired or invalid"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new ErrorHandler(401, "Unauthorized request: Token is invalid"));
        } else {
            // Catch-all for other errors
            return next(new ErrorHandler(error.status, error.message));
        }
    }
}

module.exports = isAuthenticated