const userModel = require("./userModel");
const bcrypt = require("bcryptjs");

const userRegister = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const saltLengthToGenerate = 6;

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).send({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, saltLengthToGenerate);

    const newUser = await userModel.create({ email, password: hashPassword });

    const userResponse = {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    };

    res.status(201).json(userResponse);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  userRegister,
};
