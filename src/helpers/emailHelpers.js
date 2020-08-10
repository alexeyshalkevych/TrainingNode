const sgMail = require("@sendgrid/mail");
const { createUserVerificationToken } = require("./usersHelpers");
const userModel = require("../users/userModel");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const stylesForLink = `style="
  display: inline-block;
  color: rgb(255, 255, 255); 
  padding: 10px 30px; 
  background-color: rgb(52, 142, 218); 
  text-decoration: none;
  text-transform: uppercase;
"`;

const sendGridService = async (email, verificationToken) => {
  if (!email) return;

  const htmlForSendGridService = `
    <a href='http://localhost:${process.env.PORT}/api/v1/auth/verify/${verificationToken}' ${stylesForLink}>Verify</a>
  `;

  const msg = {
    to: email,
    from: "alex.code.api@gmail.com",
    subject: "Email verification in contacts services!",
    text: "Email verification in contacts services!",
    html: htmlForSendGridService,
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
