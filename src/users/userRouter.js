const express = require("express");
const usersRouter = express.Router();
const { userRegister, userLogin, userLogOut } = require("./userController");
const {
  userAuthValidation,
  userAuthorization,
} = require("../middlewares/userMiddlewares");

usersRouter.post("/auth/register", userAuthValidation, userRegister);
usersRouter.post("/auth/login", userAuthValidation, userLogin);
usersRouter.post("/auth/logout", userAuthorization, userLogOut);

module.exports = usersRouter;
