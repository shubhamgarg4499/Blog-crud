const express = require("express");
const { loginUser, logout, loginWithToken, SignUpUser } = require("../controllers/User.controller");

const uploadOnCloudinary = require("../middlewares/Cloudinary.middleware");
const upload = require("../others/Multer.setup");
const UserRouter = express.Router()
const isAuthenticated = require("../middlewares/isAuth.middleware")
UserRouter.route("/login").post(loginUser)
UserRouter.route("/logout").post(isAuthenticated, logout)
UserRouter.route("/loginWithToken").post(isAuthenticated, loginWithToken)
UserRouter.route("/SignUpUser").post(upload.array("profilePhoto", 1), uploadOnCloudinary, SignUpUser)

module.exports = UserRouter