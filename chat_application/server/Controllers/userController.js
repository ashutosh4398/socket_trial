const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
}


const registerUSer = async (req, res) => {
    const { email, name, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json("User with given email already exists");
    }
    if (!name || !password || !email) {
        return res.status(400).json("All fields are required");
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json("Please pass valid email");
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json("Password is weak");
    }

    user = new userModel({ name, email, password });
    // password hashing...
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id);
    res.status(201).json({ _id: user._id, name, email, token });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json("User does not exists or password incorrect");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json("User does not exists or password incorrect")
    }

    const token = createToken(user._id);
    res.status(200).json({ token, name: user.name, email: user.email, _id: user._id });
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json("User not found");
    }
    return res.status(200).json({
        _id: user._id,
        name: user.name,
    })

}

const getUsers = async (req, res) => {
    const users = await userModel.find({});
    res.status(200).json(users)
}

module.exports = {
    registerUSer,
    loginUser,
    findUser,
    getUsers
};
