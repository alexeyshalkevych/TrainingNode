const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactsApi = require("./controllers/API/contacts");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:4242" }));
app.use(morgan("combined"));

app.use(contactsApi);

const PORT = process.env.PORT || 4242;

app.listen(PORT, (err) =>
  err
    ? console.warn(err)
    : console.info(`Server has been started on port ${PORT}`)
);
