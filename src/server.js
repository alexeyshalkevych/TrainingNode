const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const contactRouter = require("./contacts/contactRouter");
const userRouter = require("./users/userRouter");

require("dotenv").config();

const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:4242" }));
  app.use(morgan("combined"));

  app.use("/api/v1", contactRouter);
  app.use("/api/v1", userRouter);

  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection successful");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, (err) =>
      err
        ? console.warn(err)
        : console.info(`Server has been started on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = startServer;
