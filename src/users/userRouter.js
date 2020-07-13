const express = require("express");
const usersRouter = express.Router();
const { userRegister } = require("./userController");

usersRouter.post("/users", userRegister);

module.exports = usersRouter;
