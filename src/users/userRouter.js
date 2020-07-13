const express = require("express");
const usersRouter = express.Router();
const { userRegister } = require("./userController");
const { userRegisterValidation } = require("../middlewares/userMiddlewares");

usersRouter.post("/users", userRegisterValidation, userRegister);

module.exports = usersRouter;
