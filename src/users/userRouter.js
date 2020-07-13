const express = require("express");
const usersRouter = express.Router();
const { userRegister, userLogin } = require("./userController");
const { userRegisterValidation } = require("../middlewares/userMiddlewares");

usersRouter.post("/auth/register", userRegisterValidation, userRegister);
usersRouter.post("/auth/login", userRegisterValidation, userLogin);

module.exports = usersRouter;
