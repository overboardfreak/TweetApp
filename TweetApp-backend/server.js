require("dotenv").config();
const app = require('./app');
const port = process.env.PORT;
// const express = require("express");
require("./database/connection");
// const app = express();
app.listen(port, console.log("app is running on PORT : "+port));