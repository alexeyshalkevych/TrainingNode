const userModel = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const {
  userResponseСonversion,
  createUserAvatar,
} = require("../helpers/usersHelpers");

require("dotenv").config();

const userRegister = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const saltLengthToGenerate = 6;

    const userByEmail = await userModel.findOne({ email });

    if (userByEmail) {
      return res.status(409).send({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, saltLengthToGenerate);

    const userAvatarPath = await createUserAvatar();

    const { base } = path.parse(userAvatarPath);

    const avatarURL = `http://localhost:${process.env.PORT}/images/${base}`;

    const newUser = await userModel.create({
      email,
      password: hashPassword,
      avatarURL,
    });

    await sendVerificationEmail(newUser);

    await fs.unlink(userAvatarPath);

    res.status(201).json(userResponseСonversion(newUser));
  } catch (error) {
    return next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || user.status !== "Verified") {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userUpdate = await userModel.findByIdAndUpdate(user._id, {
      token: newToken,
    });

    res.status(201).json({
      token: newToken,
      ...userResponseСonversion(userUpdate),
    });
  } catch (error) {
    return next(error);
  }
};

const userLogOut = async (req, res, next) => {
  try {
    const { user } = req;

    await userModel.findByIdAndUpdate(user._id, { token: null });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = (req, res, next) => {
  const { user } = userResponseСonversion(req.user);

  return res.status(200).send(user);
};

const updateUserSubscription = async (req, res, next) => {
  try {
    const { user } = req;

    await userModel.findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { upsert: true, runValidators: true }
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;

    const avatarURL = `http://localhost:${process.env.PORT}/images/${file.filename}`;

    await userModel.findByIdAndUpdate(user._id, {
      avatarURL,
    });

    return res.status(200).send({ avatarURL });
  } catch (error) {
    return next(error);
  }
};

const verifyUserEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const userToVerify = userModel.findOne({ token });

    if (!userToVerify) {
      return res.status(404).send({ message: "User not found" });
    }

    await userModel.findByIdAndUpdate(
      userToVerify._id,
      {
        status: "Verified",
        verificationToken: null,
      },
      {
        new: true,
      }
    );

    return res.status(200).send({ message: "User successfully verified" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogOut,
  getCurrentUser,
  updateUserSubscription,
  updateUserAvatar,
};
