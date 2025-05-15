
const BlogRouter = require("express").Router()
const { createBlog, getAllBlog, deletePost, getpostbyid, editBlog } = require("../controllers/Blog.controller")
const uploadOnCloudinary = require("../middlewares/Cloudinary.middleware");
const upload = require("../others/Multer.setup");
BlogRouter.route("/create-blog").post(upload.array("Fimage", 1), uploadOnCloudinary, createBlog)
BlogRouter.route("/getAllBlog").get(getAllBlog)
BlogRouter.route("/deletePost/:id").delete(deletePost)
BlogRouter.route("/getBlog/:id").get(getpostbyid)
BlogRouter.route("/editBlog/:id").post(editBlog)
module.exports = BlogRouter