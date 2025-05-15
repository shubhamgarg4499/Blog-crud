
const mongoose = require('mongoose');
const ErrorHandler = require('./ErrorHandler');
require("dotenv").config()
//Set up default mongoose connection
const mongoDB_Url_ATLAS = process.env.MONGODB_URL_ATLAS;
// let isConnected
async function connectDB() {
    try {
        // if (isConnected) return console.log("connected");
        let connect = await mongoose.connect(mongoDB_Url_ATLAS);
        // isConnected = connect.connections.isConnected
        console.log(connect.connection.host)
    } catch (error) {
        // const message = error?.message || "Something went wrong while connecting DB"
        // const status = error?.status || 500
        console.log(error);
        process.exit(1)
    }
}
module.exports = connectDB