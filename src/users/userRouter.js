const express = require("express");
const usersRouter = express.Router();
const { userRegister, userLogin } = require("./userController");
const { userAuthValidation } = require("../middlewares/userMiddlewares");

usersRouter.post("/auth/register", userAuthValidation, userRegister);
usersRouter.post("/auth/login", userAuthValidation, userLogin);

module.exports = usersRouter;
