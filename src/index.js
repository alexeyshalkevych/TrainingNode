const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:4242" }));
app.use(morgan("combined"));

app.use(contactsApi);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) =>
  err
    ? console.warn(err)
    : console.info(`Server has been started on port ${PORT}`)
);
