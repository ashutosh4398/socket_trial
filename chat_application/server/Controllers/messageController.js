const messageModel = require("../Models/messageModel");

// creating message
const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new messageModel({ chatId, senderId, text });
    const messageInstance = await message.save();
    return res.status(201).json("Message sent");
};

// loading all chat messages
const getMessages = async (req, res) => {
    const { chatId } = req.params; // fetching chatId from req param
    const messages = await messageModel.find({ chatId });
    return res.status(200).json(messages);
}

module.exports = {
    createMessage,
    getMessages,
}