const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");

require('dotenv').config()


const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);


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

