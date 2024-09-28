const express = require("express");
const {
    registerUSer,
    loginUser,
    findUser,
    getUsers
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUSer);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;