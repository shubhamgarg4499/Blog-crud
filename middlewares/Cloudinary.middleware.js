const uploadImage = require("../others/Cloudinary");
const deletingImageOnCloudinary = require("../others/DeleteImageCloudinary");
const ErrorHandler = require("../others/ErrorHandler");
const fs = require('fs');
const uploadOnCloudinary = async function (req, res, next) {
    try {
        // console.log("images");
        const images = req?.files
        if (!images) return next(new ErrorHandler(400, "At least One Image Required"))
        const allUrl = []
        for (const iterator of images) {
            if (!iterator.path) continue;
            const url = await uploadImage(iterator.path)
            allUrl.push(url)
        }
        req.Images = allUrl
        for (const iterator of images) {
            if (!iterator.path) continue;
            fs.unlink(iterator.path, (err) => {


            });
        }

        next()
    } catch (error) {
        // allUrl
        if (allUrl && allUrl.length > 0) {
            for (const url of allUrl) {
                const splitUrl = url.secure_url.split("/");
                const public_id = splitUrl[splitUrl.length - 1].split(".")[0];
                await deletingImageOnCloudinary(public_id);
            }
        }
        const images = req?.files
        for (const iterator of images) {
            if (!iterator.path) continue;
            fs.unlink(iterator.path, (err) => {


            });
        }

        return next(new ErrorHandler(error.status, error.message))
    }
}

module.exports = uploadOnCloudinary