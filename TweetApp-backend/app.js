require("dotenv").config();

const port = process.env.PORT;
const express = require("express");
require("./database/connection");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");

const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cookieParser());

// port-setting
app.listen(port, console.log("app is running..."));

// routes
app.use(authRoutes);
app.use(tweetRoutes);

module.exports = app;