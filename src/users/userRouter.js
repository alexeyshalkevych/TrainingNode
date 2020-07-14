const express = require("express");
const usersRouter = express.Router();
const {
  userRegister,
  userLogin,
  userLogOut,
  getCurrentUser,
  updateUserSubscription,
} = require("./userController");
const {
  userAuthValidation,
  userAuthorization,
  userSubscriptionValidation,
} = require("../middlewares/userMiddlewares");

usersRouter.get("/users/current", userAuthorization, getCurrentUser);

usersRouter.post("/auth/register", userAuthValidation, userRegister);
usersRouter.post("/auth/login", userAuthValidation, userLogin);
usersRouter.post("/auth/logout", userAuthorization, userLogOut);

usersRouter.patch(
  "/users",
  userAuthorization,
  userSubscriptionValidation,
  updateUserSubscription
);

module.exports = usersRouter;
