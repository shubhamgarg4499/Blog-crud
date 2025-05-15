const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
const ErrorHandler = require("../others/ErrorHandler");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        required: true,

    },
    profilePhoto: {
        type: String,
    }
}, {
    timestamps: true
})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if password is unchanged
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



const user = mongoose.model("user", userSchema)
module.exports = user