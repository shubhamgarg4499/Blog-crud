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


const fs = require("fs");
const ErrorHandler = require('./ErrorHandler');

const uploadImage = async function (filePath) {
    try {
        const uploading = await cloudinary.v2.uploader.upload(filePath, { resource_type: "image", folder: "MyIndiaService" })
        fs.unlink(filePath, (error => {
            if (error) return new ErrorHandler(error.status, error.message)
        }))
        return uploading
    } catch (error) {
        fs.unlink(filePath, (error => {
            if (error) return new ErrorHandler(error.status, error.message)
        }))
    }


}

module.exports = uploadImage