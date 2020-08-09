const sgMail = require("@sendgrid/mail");
const { createUserVerificationToken } = require("./usersHelpers");
const userModel = require("../users/userModel");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGridService = async (email, verificationToken) => {
  if (!email) return;

  const msg = {
    to: email,
    from: "alex.code.api@gmail.com",
    subject: "Email verefication in contacts services!",
    text: "Email verefication in contacts services!",
    html: `<a href='http://localhost:${process.env.PORT}/users/verify/${verificationToken}'>Click here</a>`,
  };

  await sgMail.send(msg);
};

exports.sendVerificationEmail = async (user) => {
  const verificationToken = createUserVerificationToken();

  await userModel.findByIdAndUpdate(
    user._id,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );

  sendGridService(user.email, verificationToken);
};
