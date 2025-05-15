const cloudinary = require('cloudinary');
require("dotenv").config()
const cloudName = process.env.Cloudname
const apiSecret = process.env.APIsecret
const apiKey = process.env.APIkey
cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

// const cloudinary = require('cloudinary');
const ErrorHandler = require('./ErrorHandler');
const deletingImageOnCloudinary = async function (publicId) {
    try {
        const destroying = await cloudinary.v2.uploader.destroy(publicId)
        return destroying
    } catch (error) {
        return new ErrorHandler(error.status, error.message)
    }
}

module.exports = deletingImageOnCloudinary