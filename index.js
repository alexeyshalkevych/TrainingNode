const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:4242" }));
app.use(morgan("combined"));

app.get("/api/contacts", async (req, res) => {
  const contacts = await listContacts();

  return res.status(200).send(contacts);
});

app.get("/api/contacts/:contactId", async (req, res) => {
  const id = parseInt(req.params.contactId);

  const contactWithId = await getContactById(id);

  if (!contactWithId) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send(contactWithId);
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, (err) =>
  err
    ? console.warn(err)
    : console.info(`Server has been started on port ${PORT}`)
);
