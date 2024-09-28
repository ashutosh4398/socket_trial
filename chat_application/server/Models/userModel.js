const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        email: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 300,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 300,
        },
    },
    { timestamp: true }
);


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;