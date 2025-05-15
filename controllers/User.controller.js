const jwt = require('jsonwebtoken')
const user = require("../models/User.model")
const ErrorHandler = require("../others/ErrorHandler")
require("dotenv").config()
const bcrypt = require('bcrypt')
const deletingImageOnCloudinary = require('../others/DeleteImageCloudinary')



const SignUpUser = async (req, res, next) => {
    try {
        const { email, password } = req?.body

        if (!email) return next(new ErrorHandler(400, "Email required!"))
        if (!password) return next(new ErrorHandler(400, "Password required!"))
        if (password.length < 8) return next(new ErrorHandler(400, "Password should be atleast 8 characters long required!"))
        const images = req?.Images

        const lowerCaseEmail = email.toLowerCase()
        const findByEmail = await user.findOne({ email: lowerCaseEmail })
        if (findByEmail) return next(new ErrorHandler(402, "User already registered with this email!"))

        const createUser = new user({ email, password })
        if (images.length) {
            createUser.profilePhoto = images[0].secure_url || null
        }
        await createUser.save()
        res.send({ success: true, message: "User registered successfully!" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const loginUser = async (req, res, next) => {
    try {
        console.log("hii");
        const { email, password } = req?.body
        console.log(email)
        if (!email) return next(new ErrorHandler(400, "Email Required!"))
        if (!password) return next(new ErrorHandler(404, "Invalid Password!"))



        const find = await user.findOne({ email })
        if (!user) return next(new ErrorHandler(400, "Invalid credentials!"))
        const result = await bcrypt.compare(password, find.password)
        if (!result) return next(new ErrorHandler(400, "Invalid credentials!"))
        const token = await jwt.sign({ _id: find._id }, process.env.jwt_secret, { expiresIn: "3d" })

        // await find.save({ validateBeforeSave: false })
        return res.cookie("auth", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true, secure: true, sameSite: "Strict"
        }).status(200).json({ success: true, message: "Login SuccessFully!", user: find })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const logout = async (req, res, next) => {
    try {
        const { _id } = req.user
        if (!_id) return next(new ErrorHandler(403, "Unauthorised request!"))
        res.clearCookie("auth", {
            httpOnly: true, secure: true, sameSite: "Strict"
        }).send({ message: "Logout Successfully!", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const loginWithToken = async (req, res, next) => {
    try {
        const { _id } = req.user
        if (!_id) return next(new ErrorHandler(404, 'Something went wrong with token!'))
        const findUser = await user.findById(_id).select("-password")
        if (!findUser) return next(new ErrorHandler(404, 'Something went wrong with token!'))
        res.status(200).json({ message: "Logged In Successfully!", success: true, user: findUser })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
module.exports = { loginWithToken, loginUser, logout, SignUpUser }