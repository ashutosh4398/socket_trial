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

app.listen(port, (req, res) => {
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

