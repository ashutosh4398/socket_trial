const {Server} = require("socket.io");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

require('dotenv').config()


const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chat", chatRouter);
app.use("/api/messages", messageRoute);


const port = process.env.PORT || 5000;

const expressServer = app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
})

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB Connected...")
})
.catch(error=> {
    console.log(error);
})


// stuff for socket io
const io = new Server(expressServer, {"cors": "http://localhost:5173"});

let onlineUsers = [];


io.on("connection", socket => {
    console.log("socket connected =>", socket.id);
    
    // listen to a connection
    socket.on("addNewUser", userId => {
        !onlineUsers.some(user => user.userId === userId) && (
            onlineUsers.push({
                userId,
                socketId: socket.id
            })
        );

        console.log(onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);

    });

    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);
        if (!user) {
            // user is not online
            return
        }
        // send socket event to user
        io.to(user.socketId).emit("getMessage", message);
        io.to(user.socketId).emit("getNotification", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
        })
    });

    socket.on("disconnect", () => {
        console.log("Disconnect called!!!!");
        onlineUsers = onlineUsers.filter(user => user?.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });

});
