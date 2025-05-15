const blog = require("../models/Blog.model");
const deletingImageOnCloudinary = require("../others/DeleteImageCloudinary");
const ErrorHandler = require("../others/ErrorHandler");
const getPublicIdFromUrl = require("../others/GetPublicIDCloudinary");

const createBlog = async (req, res, next) => {
    try {
        const { title, content } = req.body
        const FeaturedImage = req?.Images
        if (!title) return next(new ErrorHandler(400, "Blog Title Required!"))
        if (!content) return next(new ErrorHandler(400, "Content Required!"))
        if (!FeaturedImage.length === 0) return next(new ErrorHandler(400, "Featured Image Required!"))

        const createBlog = await blog.create({ title, content, featuredImage: FeaturedImage[0].secure_url })

        res.status(201).send({ success: true, message: "Blog created Successfully" })
    } catch (error) {
        const FeaturedImage = req.Images
        await deletingImageOnCloudinary(getPublicIdFromUrl(FeaturedImage[0].secure_url))

        return next(new ErrorHandler(error.status, error.message))
    }
}
const getAllBlog = async (req, res, next) => {
    try {
        const { title, isActive, page = 1, limit = 10 } = req.query
        const filter = {}
        let skip = (page - 1) * limit
        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }


        const allBlogs = await blog.find(filter).skip(Number(skip)).limit(Number(limit))
        res.send(allBlogs)
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleteBlogPost = await blog.findByIdAndDelete(id)
        if (!deleteBlogPost) return next(new ErrorHandler(400, "Blog not Found / Invalid Blog Id"))
        await deletingImageOnCloudinary(getPublicIdFromUrl(deleteBlogPost.featuredImage))
        res.send({ success: true, message: "Blog Deleted Successfully!", deleteBlogPost })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const editBlog = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, content } = req.body
        if (!title || !content) return next(new ErrorHandler(400, "Title,Content,Slug is required"))

        const findAndUpdate = await blog.findById(id)
        if (!findAndUpdate) return next(new ErrorHandler(404, "Invalid blog id!"))
        findAndUpdate.title = title
        findAndUpdate.content = content
        await findAndUpdate.save()

        res.send({ success: true, message: "Updated successfully!" })
    } catch (error) {

        return next(new ErrorHandler(error.status, error.message))
    }
}
const getpostbyid = async (req, res, next) => {
    try {
        const { id } = req.params
        const findBlog = await blog.findById(id)
        res.send(findBlog)
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

module.exports = { createBlog, getAllBlog, deletePost, deletePost, getpostbyid, editBlog }