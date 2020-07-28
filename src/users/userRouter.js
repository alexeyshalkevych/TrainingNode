const express = require("express");
const usersRouter = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  userRegister,
  userLogin,
  userLogOut,
  getCurrentUser,
  updateUserSubscription,
  updateUserAvatar,
} = require("./userController");
const {
  userAuthValidation,
  userAuthorization,
  userSubscriptionValidation,
  userAvatarMinify,
} = require("../middlewares/userMiddlewares");

const storage = multer.diskStorage({
  destination: "src/tmp",
  filename(req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const uploadAvatar = multer({ storage });

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

usersRouter.patch(
  "/users/avatars",
  userAuthorization,
  uploadAvatar.single("avatar"),
  userAvatarMinify,
  updateUserAvatar
);

module.exports = usersRouter;
