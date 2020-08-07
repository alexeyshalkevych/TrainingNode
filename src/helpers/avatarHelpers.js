const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const axios = require("axios");

exports.avatarGenerator = avatarGenerator = async () => {
  const avatarBuffer = await axios.get(
    `https://api.adorable.io/avatars/${Math.floor(Math.random() * 285)}`,
    {
      responseType: "arraybuffer",
    }
  );

  return avatarBuffer.data;
};

exports.imageMinify = imageMinify = async (
  imageDestination,
  minifyDestination
) => {
  try {
    await imagemin([`${imageDestination}/*.{jpeg,png,jpg,svg}`], {
      destination: minifyDestination,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  } catch (error) {
    console.log(error);
  }
};
