const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const main = async (email) => {
  if (!email) return;

  const msg = {
    to: email,
    from: "alex.code.api@gmail.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  const result = await sgMail.send(msg);

  console.log(result);
};

main();
