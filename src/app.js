const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routers/user.router.js");

app.use("/api/v1/users", userRouter);

module.exports = app;
