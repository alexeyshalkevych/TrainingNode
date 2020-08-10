const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { avatarGenerator, imageMinify } = require("./avatarHelpers");

exports.userResponseСonversion = userResponseСonversion = (userResponse) => ({
  user: {
    email: userResponse.email,
    subscription: userResponse.subscription,
  },
});

exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 401;
  }
};

exports.createUserAvatar = createUserAvatar = async () => {
  const avatar = await avatarGenerator();

  const avatarPath = path.join(__dirname, `../tmp/${uuidv4()}.png`);

  await fs.writeFile(avatarPath, Buffer.from(avatar));

  const IMAGE_DESTINATION = "src/tmp";
  const MINIFY_DESTINATION = "src/public/images";

  imageMinify(IMAGE_DESTINATION, MINIFY_DESTINATION);

  return avatarPath;
};

exports.createUserVerificationToken = createUserVerificationToken = () => {
  const verificationToken = uuidv4();

  return verificationToken;
};
