const chatModel = require("../Models/chatModel");

// create Chat
const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
    const chat = await chatModel.findOne({ "members": { "$all": [firstId, secondId] } });
    if (chat) {
        return res.status(200).json(chat)
    }
    let newChat = new chatModel({ "members": [firstId, secondId] });
    newChat = await newChat.save()
    return res.status(200).json(newChat);
}
// get user chats
const findUserChats = async (req, res) => {
    const { userId } = req.params; // extracted from url param
    console.log("UserId", userId);
    const chats = await chatModel.find({ "members": { "$in": [userId] } });
    return res.status(200).json(chats);
}

// find a chat for user
const findChat = async (req, res) => {
    const { firstId, secondId } = req.params; // extracted from url params
    const chat = await chatModel.findOne({ "members": { "$all": [firstId, secondId] } });
    if (chat) {
        return res.status(200).json(chat)
    }
    let newChat = new chatModel({ "members": [firstId, secondId] });
    newChat = await newChat.save()
    return res.status(200).json(newChat);
}

module.exports = {
    createChat,
    findUserChats,
    findChat,
}